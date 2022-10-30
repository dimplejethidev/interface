import { useEffect, useRef, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";
import { useAccount, useNetwork, useProvider, useSigner } from "wagmi";

import TokenSelectField from "../TokenSelectField";
import NumberEntryField from "../NumberEntryField";
import WidgetContainer from "./WidgetContainer";
import ToastType from "../../types/ToastType";
import LoadingSpinner from "../LoadingSpinner";
import getPoolAddress from "../../helpers/getPool";
import { useStore } from "../../store";
import PricingField from "../PricingField";
import flowrates from "../../utils/flowrates";
import TransactionButton from "../TransactionButton";

interface CreateStreamWidgetProps {
    showToast: (type: ToastType) => {};
}

const CreateStreamWidget = ({ showToast }: CreateStreamWidgetProps) => {
    const store = useStore();
    const provider = useProvider();
    const { data: rainbowSigner } = useSigner();
    const signer = rainbowSigner as ethers.Signer;
    const { chain } = useNetwork();
    const { address } = useAccount();

    const [swapFlowRate, setSwapFlowRate] = useState("");
    const [loading, setLoading] = useState(false);
    const [token1Price, setToken1Price] = useState(0);
    const [priceMultiple, setPriceMultiple] = useState<BigNumber>(
        BigNumber.from(0)
    );
    const [refreshingPrice, setRefreshingPrice] = useState(false);
    const [poolExists, setPoolExists] = useState(true);

    // stream vars
    const token0Flow = useRef(BigNumber.from(0));
    const token1Flow = useRef(BigNumber.from(0));
    const userToken0Flow = useRef(BigNumber.from(0));

    const swap = async () => {
        try {
            setLoading(true);

            if (signer == null || signer == undefined) {
                showToast(ToastType.ConnectWallet);
                setLoading(false);
                return;
            }

            const chainId = chain?.id;
            const superfluid = await Framework.create({
                chainId: Number(chainId),
                provider: provider,
            });

            const pool = getPoolAddress(
                store.inboundToken.value,
                store.outboundToken.value
            );

            const token = store.outboundToken.address;

            if (token) {
                if (userToken0Flow.current.gt(0)) {
                    // update stream
                    const createFlowOperation = superfluid.cfaV1.updateFlow({
                        receiver: pool,
                        flowRate: swapFlowRate,
                        superToken: token,
                    });
                    const result = await createFlowOperation.exec(signer);
                    await result.wait();
    
                    console.log("Stream created: ", result);
                } else {
                    // create stream
                    const createFlowOperation = superfluid.cfaV1.createFlow({
                        receiver: pool,
                        flowRate: swapFlowRate,
                        superToken: token,
                    });
                    const result = await createFlowOperation.exec(signer);
                    await result.wait();
    
                    console.log("Stream created: ", result);
                }
                
                showToast(ToastType.Success);
                setLoading(false);
            }
        } catch (error) {
            console.log("Error: ", error);
            showToast(ToastType.Error);
            setLoading(false);
        }
    };

    const refreshPrice = async () => {
        setRefreshingPrice(true);

        // calculate new flows
        var calculatedToken0Flow = BigNumber.from(token0Flow.current);
        if (swapFlowRate != "") {
            calculatedToken0Flow = token0Flow.current.add(swapFlowRate).sub(userToken0Flow.current);
        }

        // calculate price multiple
        if (calculatedToken0Flow.gt(0)) {
            setToken1Price(
                token1Flow.current.mul(100000).div(calculatedToken0Flow).toNumber() /
                100000
            );
            setPriceMultiple(
                token1Flow.current
                    .mul(BigNumber.from(2).pow(128))
                    .div(calculatedToken0Flow)
            );
        } else {
            setToken1Price(0);
            setPriceMultiple(BigNumber.from(0));
        }

        await new Promise((res) => setTimeout(res, 900));
        setRefreshingPrice(false);
    };

    // update vars when tokens change
    useEffect(() => {
        const refresh = async () => {
            setRefreshingPrice(true);

            const token0Address = store.outboundToken.address;
            const token1Address = store.inboundToken.address;

            const poolABI = [
                "function getFlowIn(address token) external view returns (uint128 flowIn)",
            ];

            try {
                const poolAddress = getPoolAddress(
                    store.inboundToken.value,
                    store.outboundToken.value
                );
                setPoolExists(true);
                const poolContract = new ethers.Contract(
                    poolAddress,
                    poolABI,
                    provider
                );

                // get flows
                token0Flow.current = await poolContract.getFlowIn(token0Address);
                token1Flow.current = await poolContract.getFlowIn(token1Address);

                // get existing user flows
                if (address) {
                    const chainId = chain?.id;
                    const sf = await Framework.create({
                        chainId: Number(chainId),
                        provider: provider,
                    });

                    userToken0Flow.current = BigNumber.from(
                        (await sf.cfaV1.getFlow({
                            superToken: token0Address,
                            sender: address,
                            receiver: poolAddress,
                            providerOrSigner: provider
                        })).flowRate
                    )
                }

                await refreshPrice();
                setRefreshingPrice(false);
            } catch {
                setRefreshingPrice(false);
                setPoolExists(false);
            }
        }

        refresh();
    }, [store.inboundToken, store.outboundToken]);

    // refresh spot pricing upon user input
    useEffect(() => {
        const refresh = async () => {
            setRefreshingPrice(true);
            await refreshPrice();
            setRefreshingPrice(false);
        };

        refresh();
    }, [swapFlowRate]);
 
    return (
        <section className="flex flex-col items-center w-full">
            <WidgetContainer title="Swap">
                <TokenSelectField />
                <NumberEntryField
                    title="Flow Rate"
                    number={swapFlowRate}
                    setNumber={setSwapFlowRate}
                    dropdownItems={flowrates}
                    dropdownValue={store.flowrateUnit}
                    setDropdownValue={store.setFlowrateUnit}
                    isEther={true}
                />
                <PricingField
                    refreshingPrice={refreshingPrice}
                    token1Price={token1Price}
                    priceMultiple={priceMultiple}
                    swapFlowRate={swapFlowRate}
                    poolExists={poolExists}
                />
                <TransactionButton
                    title={userToken0Flow.current.gt(0) ? 'Update Swap' : 'Swap'}
                    loading={loading}
                    onClickFunction={swap}
                    errorMessage={!poolExists ? 'Select valid token pair' : (!swapFlowRate || BigNumber.from(swapFlowRate).lte(0) ? 'Enter flow rate' : undefined)}
                />
            </WidgetContainer>
        </section>
    );
};

export default CreateStreamWidget;

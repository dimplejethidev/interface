import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";

import TokenSelectField from "../TokenSelectField";
import NumberEntryField from "../NumberEntryField";
import WidgetContainer from "./WidgetContainer";
import ToastType from "../../types/ToastType";
import LoadingSpinner from "../LoadingSpinner";
import getPoolAddress from "../../helpers/getPool";
import { useStore } from "../../store";
import { useNetwork, useProvider, useSigner } from 'wagmi';
import Token from "../../types/Token";
import { ETHxp, fDAIxp, fUSDCxp } from "./../../utils/constants";
import tokens from "../../utils/tokens";
import { AiOutlineInfoCircle } from "react-icons/ai"
import PricingField from "../PricingField";

interface CreateStreamWidgetProps {
    showToast: (type: ToastType) => {};
}

const CreateStreamWidget = ({ showToast }: CreateStreamWidgetProps) => {
    const store = useStore();

    const [pool, setPool] = useState("");
    const [swapFlowRate, setSwapFlowRate] = useState("");
    const [loading, setLoading] = useState(false);

    const provider = useProvider();
    const { data: rainbowSigner } = useSigner();
    const signer = rainbowSigner as ethers.Signer;
    const { chain } = useNetwork();

    const [token1Price, setToken1Price] = useState(0);
    const [priceMultiple, setPriceMultiple] = useState<BigNumber>(BigNumber.from(0));
    const [refreshingPrice, setRefreshingPrice] = useState(false);
    const [poolExists, setPoolExists] = useState(true);

    const swap = async () => {
        try {
            setLoading(true);

            const formattedFlowRate: BigNumber = ethers.utils.parseUnits(swapFlowRate, "ether");

            if (signer == null || signer == undefined) { showToast(ToastType.ConnectWallet); setLoading(false); return }

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
                const createFlowOperation = superfluid.cfaV1.createFlow({
                    receiver: pool,
                    flowRate: formattedFlowRate.toString(),
                    superToken: token,
                });
                const result = await createFlowOperation.exec(signer);
                await result.wait();

                console.log("Stream created: ", result);
                showToast(ToastType.Success);
                setLoading(false);
            }
        } catch (error) {
            console.log("Error: ", error);
            showToast(ToastType.Error);
            setLoading(false);
        }
    };

    // refresh spot pricing upon user input
    useEffect(() => {
        const refreshPrice = async () => {
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
                const poolContract = new ethers.Contract(poolAddress, poolABI, provider);

                // get flows
                var token0Flow: BigNumber = await poolContract.getFlowIn(token0Address);
                var token1Flow: BigNumber = await poolContract.getFlowIn(token1Address);

                // calculate new flows
                if (swapFlowRate != '') {
                    token0Flow = token0Flow.add(swapFlowRate);
                }

                // calculate price multiple
                if (token0Flow.gt(0)) {
                    setToken1Price(
                        token1Flow.mul(100000).div(token0Flow).toNumber() / 100000
                    )
                    setPriceMultiple(
                        token1Flow.mul(BigNumber.from(2).pow(128)).div(token0Flow)
                    )
                } else {
                    setToken1Price(0);
                    setPriceMultiple(BigNumber.from(0));
                }

                await new Promise(res => setTimeout(res, 900));
                setRefreshingPrice(false);
            } catch {
                setRefreshingPrice(false);
                setPoolExists(false);
            }
        }

        refreshPrice();
    }, [swapFlowRate, store.inboundToken, store.outboundToken])

    return (
        <section className="flex flex-col items-center w-full">
            <WidgetContainer title="Swap">
                <TokenSelectField />
                <NumberEntryField
                    title="FlowRate ( ether / sec )"
                    number={swapFlowRate}
                    setNumber={setSwapFlowRate}
                />
                <PricingField refreshingPrice={refreshingPrice} token1Price={token1Price} priceMultiple={priceMultiple} swapFlowRate={swapFlowRate} poolExists={poolExists} />

                {loading ? (
                    <div className="flex justify-center items-center h-14 bg-aqueductBlue/90 text-white rounded-2xl outline-2">
                        <LoadingSpinner size={30} />
                    </div>
                ) : (
                    <button
                        className="h-14 bg-aqueductBlue/90 text-white font-bold rounded-2xl hover:outline outline-2"
                        onClick={() => swap()}
                    >
                        Swap
                    </button>
                )}
            </WidgetContainer>
        </section>
    );
};
//opacity={refreshingPrice ? 0 : 0.5}

export default CreateStreamWidget;

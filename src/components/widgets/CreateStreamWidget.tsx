import { useEffect, useRef, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";
import { useAccount, useNetwork, useProvider, useSigner } from "wagmi";
import WidgetContainer from "./WidgetContainer";
import ToastType from "../../types/ToastType";
import getPoolAddress from "../../helpers/getPool";
import { useStore } from "../../store";
import PricingField from "../PricingField";
import flowrates from "../../utils/flowrates";
import TransactionButton from "../TransactionButton";
import RealTimeBalance from "../RealTimeBalance";
import { IoArrowDown } from "react-icons/io5";
import { TokenOption } from "../../types/TokenOption";
import TokenFlowField from "../TokenFlowField";
import BufferWarning from "../BufferWarning";
import getToastErrorType from "../../utils/getToastErrorType";

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

    // user input
    const [displayedSwapFlowRate, setDisplayedSwapFlowRate] = useState<string>('');
    const [displayedExpectedFlowRate, setDisplayedExpectedFlowRate] = useState<string>('');
    const [swapFlowRate, setSwapFlowRate] = useState("");
    const [expectedFlowRate, setExpectedFlowRate] = useState("");
    const [loading, setLoading] = useState(false);
    const [token0Price, setToken0Price] = useState(0);
    const [priceMultiple, setPriceMultiple] = useState<BigNumber>(BigNumber.from(0));
    const [reversePriceMultiple, setReversePriceMultiple] = useState<BigNumber>(BigNumber.from(0));
    const [refreshingPrice, setRefreshingPrice] = useState(false);
    const [poolExists, setPoolExists] = useState(true);
    const isReversePricing = useRef(false);

    // stream vars
    const token0Flow = useRef(BigNumber.from(0));
    const token1Flow = useRef(BigNumber.from(0));
    const userToken0Flow = useRef(BigNumber.from(0));
    const userToken1Flow = useRef(BigNumber.from(0));
    const [minBalance, setMinBalance] = useState(BigNumber.from(0));
    const [deposit, setDeposit] = useState(BigNumber.from(0));

    // buffer confirmation
    const [acceptedBuffer, setAcceptedBuffer] = useState(false);

    // user vars
    const [outboundTokenBalance, setOutboundTokenBalance] = useState(BigNumber.from(0));
    const [inboundTokenBalance, setInboundTokenBalance] = useState(BigNumber.from(0));

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

                    //console.log("Stream created: ", result);
                }

                showToast(ToastType.Success);
                setLoading(false);
            }
        } catch (error) {
            //console.log("Error: ", error);
            showToast(getToastErrorType(error));
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

        // calculate token 0 price
        if (token1Flow.current.gt(0)) {
            setToken0Price(
                parseFloat(calculatedToken0Flow.toString()) / parseFloat(token1Flow.current.toString())
            )
        } else {
            setToken0Price(0);
        }

        // calculate price multiple
        if (calculatedToken0Flow.gt(0)) {
            setPriceMultiple(
                token1Flow.current
                    .mul(BigNumber.from(2).pow(128))
                    .div(calculatedToken0Flow)
            );
        } else {
            setPriceMultiple(BigNumber.from(0));
        }

        // calculate deposit
        if (swapFlowRate != "") {
            // assume 1 hr length for deposit // TODO: mainnet is 4 hrs, detect network and adjust deposit period
            const oneHourStream = BigNumber.from(swapFlowRate).mul(3600);
            setDeposit(oneHourStream);

            // had hard time determining min balance, default to 2 hours of streaming for now // TODO: detect network and adjust
            setMinBalance(oneHourStream.mul(2));
        }

        // reset deposit agreement
        setAcceptedBuffer(false);

        await new Promise((res) => setTimeout(res, 900));
        setRefreshingPrice(false);
    };

    // if price multiple changes, calculate new expected outgoing flowrate
    useEffect(() => {
        if (isReversePricing.current == false) {
            // calculate expected outgoing flowrate
            if (swapFlowRate != '') {
                setDisplayedExpectedFlowRate(
                    ethers.utils.formatEther(
                        BigNumber.from(swapFlowRate)
                            .mul(priceMultiple)
                            .mul(store.flowrateUnit.value)
                            .div(BigNumber.from(2).pow(128))
                    )
                )
            } else {
                setDisplayedExpectedFlowRate('');
            }
        } else {
            // calculate needed swap flowrate
            if (swapFlowRate != '') {
                setDisplayedSwapFlowRate(
                    ethers.utils.formatEther(BigNumber.from(swapFlowRate).mul(store.flowrateUnit.value))
                )
            }
        }
    }, [priceMultiple])

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
                    userToken1Flow.current = BigNumber.from(
                        (await sf.cfaV1.getFlow({
                            superToken: token1Address,
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
    }, [store.inboundToken, store.outboundToken, address, chain]);

    // refresh spot pricing upon user input
    useEffect(() => {
        const refresh = async () => {
            setRefreshingPrice(true);
            await refreshPrice();

            if (isReversePricing.current == true) {
                isReversePricing.current = false;
            }
            setRefreshingPrice(false);
        };

        refresh();
    }, [swapFlowRate]);

    // calculate reverse pricing if user edits expected outgoing flow
    useEffect(() => {
        const refresh = async () => {
            isReversePricing.current = true;

            // calculate swap flow rate
            if (expectedFlowRate != '' && BigNumber.from(expectedFlowRate).gt(0)) {
                setSwapFlowRate(
                    token0Flow.current
                        .sub(userToken0Flow.current)
                        .mul(BigNumber.from(10).pow(18))
                        .div(
                            token1Flow.current.mul(BigNumber.from(10).pow(18))
                                .div(expectedFlowRate)
                                .sub(BigNumber.from(10).pow(18))
                        )
                        .toString()
                )
            } else {
                setSwapFlowRate('')
                setDisplayedSwapFlowRate('');
            }
        };

        refresh();
    }, [expectedFlowRate]);

    return (
        <section className="flex flex-col items-center w-full">
            <RealTimeBalance token={store.outboundToken} setBalance={setOutboundTokenBalance} />
            <RealTimeBalance token={store.inboundToken} setBalance={setInboundTokenBalance} />
            <WidgetContainer title="Swap">
                <div className="flex flex-col items-center justify-center">
                    <div className="w-full py-1">
                        <TokenFlowField
                            title="Flow Rate"
                            displayedValue={displayedSwapFlowRate}
                            setDisplayedValue={setDisplayedSwapFlowRate}
                            formattedValue={swapFlowRate}
                            setFormattedValue={setSwapFlowRate}
                            dropdownItems={flowrates}
                            dropdownValue={store.flowrateUnit}
                            setDropdownValue={store.setFlowrateUnit}
                            isEther={true}
                            shouldReformat={true}
                            currentBalance={outboundTokenBalance}
                            token={store.outboundToken}
                            setToken={store.setOutboundToken}
                        />
                    </div>
                    <button
                        className="flex items-center justify-center w-10 h-10 -my-5 z-10 bg-white rounded-xl border-[1px] centered-shadow-sm dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:centered-shadow-sm-dark"
                        onClick={() => {
                            const oldOutbound: TokenOption = store.outboundToken;
                            store.setOutboundToken(store.inboundToken);
                            store.setInboundToken(oldOutbound);
                        }}
                    >
                        <IoArrowDown size={20} />
                    </button>
                    <div className="w-full py-1">
                        <TokenFlowField
                            title="Flow Rate"
                            displayedValue={displayedExpectedFlowRate}
                            setDisplayedValue={setDisplayedExpectedFlowRate}
                            formattedValue={expectedFlowRate}
                            setFormattedValue={setExpectedFlowRate}
                            isEther={true}
                            shouldReformat={false}
                            currentBalance={inboundTokenBalance}
                            token={store.inboundToken}
                            setToken={store.setInboundToken}
                        />
                    </div>
                </div>
                <PricingField
                    refreshingPrice={refreshingPrice}
                    token0Price={token0Price}
                    priceMultiple={priceMultiple}
                    swapFlowRate={swapFlowRate}
                    poolExists={poolExists}
                />
                {
                    poolExists && swapFlowRate &&
                    <BufferWarning
                        minBalance={minBalance}
                        outboundTokenBalance={outboundTokenBalance}
                        outboundToken={store.outboundToken}
                        buffer={deposit}
                        acceptedBuffer={acceptedBuffer}
                        setAcceptedBuffer={setAcceptedBuffer}
                    />
                }
                <TransactionButton
                    title={userToken0Flow.current.gt(0) ? 'Update Swap' : 'Swap'}
                    loading={loading}
                    onClickFunction={swap}
                    errorMessage={!poolExists ? 'Select valid token pair' : (!swapFlowRate || BigNumber.from(swapFlowRate).lte(0) ? 'Enter flow rate' : (!acceptedBuffer ? (userToken0Flow.current.gt(0) ? 'Update Swap' : 'Swap') : undefined))}
                />
            </WidgetContainer>
        </section >
    );
};

export default CreateStreamWidget;

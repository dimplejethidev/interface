import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
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
import { IoSwapVertical } from "react-icons/io5";
import TokenFlowField from "../TokenFlowField";
import BufferWarning from "../BufferWarning";
import ReadOnlyFlowOutput from "../ReadOnlyFlowOutput";
import Operation from "@superfluid-finance/sdk-core/dist/module/Operation";
import getToastErrorType from "../../utils/getToastErrorType";

interface ProvideLiquidityWidgetProps {
    showToast: (type: ToastType) => {};
    setKeyNum: Dispatch<SetStateAction<number>>;
}

const ProvideLiquidityWidget = ({ showToast, setKeyNum }: ProvideLiquidityWidgetProps) => {
    const store = useStore();
    const provider = useProvider();
    const { data: rainbowSigner } = useSigner();
    const signer = rainbowSigner as ethers.Signer;
    const { chain } = useNetwork();
    const { address } = useAccount();

    // user input
    const [displayedSwapFlowRate0, setDisplayedSwapFlowRate0] = useState<string>('');
    const [displayedExpectedFlowRate0, setDisplayedExpectedFlowRate0] = useState<string>('');
    const [displayedSwapFlowRate1, setDisplayedSwapFlowRate1] = useState<string>('');
    const [displayedExpectedFlowRate1, setDisplayedExpectedFlowRate1] = useState<string>('');
    const [swapFlowRate0, setSwapFlowRate0] = useState("");
    const [swapFlowRate1, setSwapFlowRate1] = useState("");

    const [loading, setLoading] = useState(false);
    const [token0Price, setToken0Price] = useState(0);
    const [priceMultiple0, setPriceMultiple0] = useState<BigNumber>(BigNumber.from(0));
    const [priceMultiple1, setPriceMultiple1] = useState<BigNumber>(BigNumber.from(0));
    const [refreshingPrice, setRefreshingPrice] = useState(false);
    const [poolExists, setPoolExists] = useState(true);
    const [priceTimeout, setPriceTimeout] = useState<NodeJS.Timeout|undefined>(undefined);

    // stream vars
    const token0Flow = useRef(BigNumber.from(0));
    const token1Flow = useRef(BigNumber.from(0));
    const userToken0Flow = useRef(BigNumber.from(0));
    const userToken1Flow = useRef(BigNumber.from(0));
    const [minBalance0, setMinBalance0] = useState(BigNumber.from(0));
    const [deposit0, setDeposit0] = useState(BigNumber.from(0));
    const [minBalance1, setMinBalance1] = useState(BigNumber.from(0));
    const [deposit1, setDeposit1] = useState(BigNumber.from(0));

    // buffer confirmations
    const [acceptedBuffer, setAcceptedBuffer] = useState(false);

    // user vars
    const [outboundTokenBalance, setOutboundTokenBalance] = useState(BigNumber.from(0));
    const [inboundTokenBalance, setInboundTokenBalance] = useState(BigNumber.from(0));

    const provideLiquidity = async () => {
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

            const token0 = store.outboundToken.address;
            const token1 = store.inboundToken.address;

            if (token0 && token1 && pool) {
                var operation0: Operation;
                if (userToken0Flow.current.gt(0)) {
                    // update flow
                    operation0 = superfluid.cfaV1.updateFlow({
                        receiver: pool,
                        flowRate: swapFlowRate0,
                        superToken: token0,
                    });
                } else {
                    // create flow
                    operation0 = superfluid.cfaV1.createFlow({
                        receiver: pool,
                        flowRate: swapFlowRate0,
                        superToken: token0,
                    });
                }

                var operation1: Operation;
                if (userToken0Flow.current.gt(0)) {
                    operation1 = superfluid.cfaV1.updateFlow({
                        receiver: pool,
                        flowRate: swapFlowRate1,
                        superToken: token1,
                    });
                } else {
                    // create flow
                    operation1 = superfluid.cfaV1.createFlow({
                        receiver: pool,
                        flowRate: swapFlowRate1,
                        superToken: token1,
                    });
                }

                if (operation0 && operation1) {
                    const batchCall = superfluid.batchCall([
                        operation0,
                        operation1,
                    ]);
                    const result = await batchCall.exec(signer);
                    await result.wait();

                    //console.log("Streams created: ", result);
                    showToast(ToastType.Success);

                    // clear state after successful transaction
                    setKeyNum(k => k + 1);
                }

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

        // clear any existing timeouts
        if (priceTimeout) {
            clearTimeout(priceTimeout);
            setPriceTimeout(undefined);
        }

        // set a timeout
        const timeout: NodeJS.Timeout = setTimeout(async () => {
            // calculate new flows
            var calculatedToken0Flow = BigNumber.from(token0Flow.current);
            if (swapFlowRate0 != "") {
                calculatedToken0Flow = token0Flow.current.add(swapFlowRate0).sub(userToken0Flow.current);
            }
            var calculatedToken1Flow = BigNumber.from(token1Flow.current);
            if (swapFlowRate1 != "") {
                calculatedToken1Flow = token1Flow.current.add(swapFlowRate1).sub(userToken1Flow.current);
            }

            // calculate price multiples
            if (calculatedToken0Flow.gt(0)) {
                setPriceMultiple0(
                    calculatedToken1Flow
                        .mul(BigNumber.from(2).pow(128))
                        .div(calculatedToken0Flow)
                );
            } else {
                setPriceMultiple0(BigNumber.from(0));
            }

            if (calculatedToken1Flow.gt(0)) {
                setPriceMultiple1(
                    calculatedToken0Flow
                        .mul(BigNumber.from(2).pow(128))
                        .div(calculatedToken1Flow)
                );
            } else {
                setPriceMultiple1(BigNumber.from(0));
            }

            if (calculatedToken0Flow.gt(0) && calculatedToken1Flow.gt(0)) {
                setToken0Price(
                    parseFloat(calculatedToken0Flow.toString()) / parseFloat(calculatedToken1Flow.toString())
                );
            } else {
                setToken0Price(0);
            }

            // calculate deposits
            if (swapFlowRate0 != "") {
                // assume 1 hr length for deposit // TODO: mainnet is 4 hrs, detect network and adjust deposit period
                const oneHourStream = BigNumber.from(swapFlowRate0).mul(3600);
                setDeposit0(oneHourStream);

                // had hard time determining min balance, default to 2 hours of streaming for now // TODO: detect network and adjust
                setMinBalance0(oneHourStream.mul(2));
            }

            if (swapFlowRate1 != "") {
                const oneHourStream = BigNumber.from(swapFlowRate1).mul(3600);
                setDeposit1(oneHourStream);
                setMinBalance1(oneHourStream.mul(2));
            }

            // reset deposit agreement
            setAcceptedBuffer(false);

            await new Promise((res) => setTimeout(res, 900));
            setRefreshingPrice(false);
        }, 500)

        setPriceTimeout(timeout);
    };

    // if price multiple changes, calculate new expected outgoing flowrate
    useEffect(() => {
        // calculate expected outgoing flowrate
        if (swapFlowRate0 != '') {
            setDisplayedExpectedFlowRate0(
                ethers.utils.formatEther(
                    BigNumber.from(swapFlowRate0)
                        .mul(priceMultiple0)
                        .mul(store.flowrateUnit.value)
                        .div(BigNumber.from(2).pow(128))
                )
            )
        } else {
            setDisplayedExpectedFlowRate0('');
        }
    }, [priceMultiple0])
    useEffect(() => {
        // calculate expected outgoing flowrate
        if (swapFlowRate1 != '') {
            setDisplayedExpectedFlowRate1(
                ethers.utils.formatEther(
                    BigNumber.from(swapFlowRate1)
                        .mul(priceMultiple1)
                        .mul(store.flowrateUnit.value)
                        .div(BigNumber.from(2).pow(128))
                )
            )
        } else {
            setDisplayedExpectedFlowRate1('');
        }
    }, [priceMultiple1])

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
            setRefreshingPrice(false);
        };

        refresh();
    }, [swapFlowRate0, swapFlowRate1]);

    return (
        <section className="flex flex-col items-center w-full">
            <RealTimeBalance token={store.outboundToken} setBalance={setOutboundTokenBalance} />
            <RealTimeBalance token={store.inboundToken} setBalance={setInboundTokenBalance} />
            <WidgetContainer title="Provide Liquidity">
                <div className="flex flex-col items-center space-y-2 py-1">
                    <TokenFlowField
                        title="Flow Rate"
                        displayedValue={displayedSwapFlowRate0}
                        setDisplayedValue={setDisplayedSwapFlowRate0}
                        formattedValue={swapFlowRate0}
                        setFormattedValue={setSwapFlowRate0}
                        dropdownItems={flowrates}
                        dropdownValue={store.flowrateUnit}
                        setDropdownValue={store.setFlowrateUnit}
                        isEther={true}
                        shouldReformat={true}
                        currentBalance={outboundTokenBalance}
                        token={store.outboundToken}
                        setToken={store.setOutboundToken}
                    />
                    <div className="w-full">
                        <ReadOnlyFlowOutput
                            displayedValue={displayedExpectedFlowRate0}
                            token={store.inboundToken}
                        />
                    </div>
                    <div className="py-2">
                        <div className="flex items-center justify-center w-10 h-10 bg-white rounded-xl border-[1px] dark:bg-gray-900 dark:text-white dark:border-gray-700">
                            <IoSwapVertical size={20} />
                        </div>
                    </div>
                    <TokenFlowField
                        title="Flow Rate"
                        displayedValue={displayedSwapFlowRate1}
                        setDisplayedValue={setDisplayedSwapFlowRate1}
                        formattedValue={swapFlowRate1}
                        setFormattedValue={setSwapFlowRate1}
                        isEther={true}
                        shouldReformat={true}
                        currentBalance={inboundTokenBalance}
                        token={store.inboundToken}
                        setToken={store.setInboundToken}
                    />
                    <div className="w-full">
                        <ReadOnlyFlowOutput
                            displayedValue={displayedExpectedFlowRate1}
                            token={store.outboundToken}
                        />
                    </div>
                </div>
                <PricingField
                    refreshingPrice={refreshingPrice}
                    token0Price={token0Price}
                    poolExists={poolExists}
                />
                {
                    poolExists && swapFlowRate0 && swapFlowRate1 &&
                    <div className="space-y-2">
                        <BufferWarning
                            minBalance={minBalance0}
                            outboundTokenBalance={outboundTokenBalance}
                            outboundToken={store.outboundToken}
                            buffer={deposit0}
                            acceptedBuffer={acceptedBuffer}
                        />
                        <BufferWarning
                            minBalance={minBalance1}
                            outboundTokenBalance={inboundTokenBalance}
                            outboundToken={store.inboundToken}
                            buffer={deposit1}
                            acceptedBuffer={acceptedBuffer}
                            setAcceptedBuffer={setAcceptedBuffer}
                            shouldHideAcceptButton={minBalance0.gte(outboundTokenBalance)}
                        />
                    </div>
                }
                <TransactionButton
                    title={userToken0Flow.current.gt(0) || userToken1Flow.current.gt(0) ? 'Update Position' : 'Provide Liquidity'}
                    loading={loading}
                    onClickFunction={provideLiquidity}
                    errorMessage={
                        !poolExists ?
                            'Select valid token pair' :
                            (
                                !swapFlowRate0 || BigNumber.from(swapFlowRate0).lte(0) || !swapFlowRate1 || BigNumber.from(swapFlowRate1).lte(0) ?
                                    'Enter flow rates' :
                                    (
                                        !acceptedBuffer ? (userToken0Flow.current.gt(0) || userToken1Flow.current.gt(0) ? 'Update Position' : 'Provide Liquidity') : undefined
                                    )
                            )
                    }
                />
            </WidgetContainer>
        </section >
    );
};

export default ProvideLiquidityWidget;

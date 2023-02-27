import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";
import { useAccount, useNetwork, useProvider, useSigner } from "wagmi";
import { IoArrowDown } from "react-icons/io5";

import WidgetContainer from "./WidgetContainer";
import getPoolAddress from "../../helpers/getPool";
import { useStore } from "../../store";
import PricingField from "../PricingField";
import flowrates from "../../utils/flowrates";
import TransactionButton from "../TransactionButton";
import RealTimeBalance from "../RealTimeBalance";
import { TokenOption } from "../../types/TokenOption";
import TokenFlowField from "../TokenFlowField";
import BufferWarning from "../BufferWarning";
import { TutorialItemState, useTutorial } from "../../utils/TutorialProvider";
import PriceImpactWarning from "../PriceImpactWarning";
import { goerliChainId } from "../../utils/constants";
import {
    showConnectWalletToast,
    showTransactionConfirmedToast,
} from "../Toasts";
import getErrorToast from "../../utils/getErrorToast";

interface CreateStreamWidgetProps {
    setKeyNum: Dispatch<SetStateAction<number>>;
}

// TODO: Why do we have two CreateStreamWidget's? See UpgradeDowngradeWidget.ts
const CreateStreamWidget = ({ setKeyNum }: CreateStreamWidgetProps) => {
    const store = useStore();
    const provider = useProvider();
    const { data: rainbowSigner } = useSigner();
    const signer = rainbowSigner as ethers.Signer;
    const { chain } = useNetwork();
    const { address } = useAccount();
    const tutorialContext = useTutorial();

    // user input
    const [displayedSwapFlowRate, setDisplayedSwapFlowRate] =
        useState<string>("");
    const [displayedExpectedFlowRate, setDisplayedExpectedFlowRate] =
        useState<string>("");
    const [swapFlowRate, setSwapFlowRate] = useState("");
    const [expectedFlowRate, setExpectedFlowRate] = useState("");
    const [loading, setLoading] = useState(false);
    const [token0Price, setToken0Price] = useState(0);
    const [priceMultiple, setPriceMultiple] = useState<BigNumber>(
        BigNumber.from(0)
    );

    const [refreshingPrice, setRefreshingPrice] = useState(false);
    const [poolExists, setPoolExists] = useState(true);
    const isReversePricing = useRef(false);
    const [priceTimeout, setPriceTimeout] = useState<
        NodeJS.Timeout | undefined
    >(undefined);
    const [priceImpact, setPriceImpact] = useState<number>(0);

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
    const [outboundTokenBalance, setOutboundTokenBalance] = useState(
        BigNumber.from(0)
    );
    const [inboundTokenBalance, setInboundTokenBalance] = useState(
        BigNumber.from(0)
    );

    const swap = async () => {
        setLoading(true);

        if (signer === null || signer === undefined) {
            showConnectWalletToast();
            setLoading(false);
            return;
        }

        const pool = getPoolAddress(
            store.inboundToken.value,
            store.outboundToken.value
        );
        const token = store.outboundToken.address;

        let transactionHash;
        try {
            const superfluid = await Framework.create({
                chainId:
                    (provider && provider.chains && provider.chains[0].id) ??
                    goerliChainId,
                provider,
            });

            const sender = await signer.getAddress();

            if (token) {
                if (userToken0Flow.current.gt(0)) {
                    // update stream
                    const updateFlowOperation = superfluid.cfaV1.updateFlow({
                        receiver: pool,
                        flowRate: swapFlowRate,
                        superToken: token,
                        sender,
                    });
                    const result = await updateFlowOperation.exec(signer);
                    transactionHash = result.hash;
                    const transactionReceipt = await result.wait();
                    showTransactionConfirmedToast(
                        "Swap updated",
                        transactionReceipt.transactionHash
                    );
                } else {
                    // create stream
                    const createFlowOperation = superfluid.cfaV1.createFlow({
                        receiver: pool,
                        flowRate: swapFlowRate,
                        superToken: token,
                        sender,
                    });
                    const result = await createFlowOperation.exec(signer);
                    transactionHash = result.hash;
                    const transactionReceipt = await result.wait();
                    showTransactionConfirmedToast(
                        "Swap started",
                        transactionReceipt.transactionHash
                    );

                    // mark item completed, setTimeout fixes problem related to component reset
                    setTimeout(() => {
                        tutorialContext?.setStartedSwap(
                            TutorialItemState.Complete
                        );
                    }, 0);
                }

                setLoading(false);
                // clear state after successful transaction
                setKeyNum((k) => k + 1);
            }
        } catch (error) {
            getErrorToast(error, transactionHash);
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
            let calculatedToken0Flow = BigNumber.from(token0Flow.current);
            if (swapFlowRate !== "") {
                calculatedToken0Flow = token0Flow.current
                    .add(swapFlowRate)
                    .sub(userToken0Flow.current);
            }

            // calculate token 0 price
            if (token1Flow.current.gt(0)) {
                setToken0Price(
                    parseFloat(calculatedToken0Flow.toString()) /
                        parseFloat(token1Flow.current.toString())
                );
            } else {
                setToken0Price(0);
            }

            if (calculatedToken0Flow.gt(0)) {
                // calculate price multiple
                setPriceMultiple(
                    token1Flow.current
                        .mul(BigNumber.from(2).pow(128))
                        .div(calculatedToken0Flow)
                );

                // calculate price impact
                setPriceImpact(
                    1 -
                        parseFloat(token0Flow.current.toString()) /
                            parseFloat(calculatedToken0Flow.toString())
                );
            } else {
                setPriceMultiple(BigNumber.from(0));
                setPriceImpact(0);
            }

            // calculate deposit
            if (swapFlowRate !== "") {
                // assume 1 hr length for deposit // TODO: mainnet is 4 hrs, detect network and adjust deposit period
                const oneHourStream = BigNumber.from(swapFlowRate).mul(3600);
                setDeposit(oneHourStream);

                // had hard time determining min balance, default to 2 hours of streaming for now // TODO: detect network and adjust
                setMinBalance(oneHourStream.mul(2));
            }

            // reset deposit agreement
            setAcceptedBuffer(false);

            // eslint-disable-next-line no-promise-executor-return
            await new Promise((res) => setTimeout(res, 900));
            setRefreshingPrice(false);
        }, 500);

        setPriceTimeout(timeout);
    };

    // if price multiple changes, calculate new expected outgoing flowrate
    useEffect(() => {
        if (isReversePricing.current === false) {
            // calculate expected outgoing flowrate
            if (swapFlowRate !== "") {
                setDisplayedExpectedFlowRate(
                    ethers.utils.formatEther(
                        BigNumber.from(swapFlowRate)
                            .mul(priceMultiple)
                            .mul(store.flowrateUnit.value)
                            .div(BigNumber.from(2).pow(128))
                    )
                );
            } else {
                setDisplayedExpectedFlowRate("");
            }
        } else {
            // calculate needed swap flowrate
            if (swapFlowRate !== "") {
                setDisplayedSwapFlowRate(
                    ethers.utils.formatEther(
                        BigNumber.from(swapFlowRate).mul(
                            store.flowrateUnit.value
                        )
                    )
                );
            }

            // turn off reverse pricing
            isReversePricing.current = false;
        }
        // TODO: Assess missing dependency array values
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [priceMultiple]);

    // update vars when tokens change
    useEffect(() => {
        const updateFlowVars = async () => {
            const token0Address = store.outboundToken.address;
            const token1Address = store.inboundToken.address;

            try {
                const poolAddress = getPoolAddress(
                    store.inboundToken.value,
                    store.outboundToken.value
                );
                setPoolExists(true);

                // init sf framework
                const sf = await Framework.create({
                    chainId:
                        (provider &&
                            provider.chains &&
                            provider.chains[0].id) ??
                        goerliChainId,
                    provider,
                });

                // get flows
                token0Flow.current = BigNumber.from(
                    await sf.cfaV1.getNetFlow({
                        superToken: token0Address,
                        account: poolAddress,
                        providerOrSigner: provider,
                    })
                );
                token1Flow.current = BigNumber.from(
                    await sf.cfaV1.getNetFlow({
                        superToken: token1Address,
                        account: poolAddress,
                        providerOrSigner: provider,
                    })
                );

                // get existing user flows
                if (address) {
                    userToken0Flow.current = BigNumber.from(
                        (
                            await sf.cfaV1.getFlow({
                                superToken: token0Address,
                                sender: address,
                                receiver: poolAddress,
                                providerOrSigner: provider,
                            })
                        ).flowRate
                    );
                    userToken1Flow.current = BigNumber.from(
                        (
                            await sf.cfaV1.getFlow({
                                superToken: token1Address,
                                sender: address,
                                receiver: poolAddress,
                                providerOrSigner: provider,
                            })
                        ).flowRate
                    );
                }

                await refreshPrice();
            } catch (err) {
                setRefreshingPrice(false);
                setPoolExists(false);
            }
        };

        updateFlowVars();
        // TODO: Assess missing dependency array values
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store.inboundToken, store.outboundToken, address, chain]);

    // refresh spot pricing upon user input
    useEffect(() => {
        const updatePrice = async () => {
            await refreshPrice();
        };

        updatePrice();

        // TODO: Assess missing dependency array values
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [swapFlowRate]);

    // calculate reverse pricing if user edits expected outgoing flow
    useEffect(() => {
        const calculateReversePricing = async () => {
            isReversePricing.current = true;

            // calculate swap flow rate
            if (
                expectedFlowRate !== "" &&
                BigNumber.from(expectedFlowRate).gt(0)
            ) {
                setSwapFlowRate(
                    token0Flow.current
                        .sub(userToken0Flow.current)
                        .mul(BigNumber.from(10).pow(18))
                        .div(
                            token1Flow.current
                                .mul(BigNumber.from(10).pow(18))
                                .div(expectedFlowRate)
                                .sub(BigNumber.from(10).pow(18))
                        )
                        .toString()
                );
            } else {
                setSwapFlowRate("");
                setDisplayedSwapFlowRate("");
            }
        };

        calculateReversePricing();
    }, [expectedFlowRate]);

    const swapInboundAndOutboundToken = () => {
        const oldOutbound: TokenOption = store.outboundToken;
        store.setOutboundToken(store.inboundToken);
        store.setInboundToken(oldOutbound);
    };

    const getTransactionButtonDisabledMessage = () => {
        if (!signer) {
            return "Connect wallet";
        }
        if (!poolExists) {
            return "Select valid token pair";
        }
        if (!swapFlowRate || BigNumber.from(swapFlowRate).lte(0)) {
            return "Enter flow rate";
        }
        if (!acceptedBuffer) {
            if (userToken0Flow.current.gt(0)) {
                return "Update Swap";
            }
            return "Swap";
        }
        return undefined;
    };

    return (
        <section className="flex flex-col items-center w-full">
            <RealTimeBalance
                token={store.outboundToken}
                setBalance={setOutboundTokenBalance}
            />
            <RealTimeBalance
                token={store.inboundToken}
                setBalance={setInboundTokenBalance}
            />
            <WidgetContainer title="Swap">
                <div className="flex flex-col items-center justify-center">
                    <div className="w-full py-1 ">
                        <div
                            className={
                                tutorialContext?.startedSwap ===
                                TutorialItemState.ShowHint
                                    ? "after:rounded-2xl relative after:pointer-events-none after:animate-border after:border-2 after:border-aqueductBlue after:top-0 after:absolute after:bottom-0 after:left-0 after:right-0"
                                    : ""
                            }
                        >
                            <TokenFlowField
                                displayedValue={displayedSwapFlowRate}
                                setDisplayedValue={setDisplayedSwapFlowRate}
                                setFormattedValue={setSwapFlowRate}
                                dropdownItems={flowrates}
                                dropdownValue={store.flowrateUnit}
                                setDropdownValue={store.setFlowrateUnit}
                                isEther
                                shouldReformat
                                currentBalance={outboundTokenBalance}
                                token={store.outboundToken}
                                setToken={store.setOutboundToken}
                                fieldLabel={`${store.outboundToken.label} swap flow-rate`}
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        className="flex items-center justify-center w-10 h-10 -my-5 z-10 bg-white rounded-xl border-[1px] centered-shadow-sm dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:centered-shadow-sm-dark"
                        onClick={() => swapInboundAndOutboundToken()}
                    >
                        <IoArrowDown size={20} />
                    </button>
                    <div className="w-full py-1">
                        <TokenFlowField
                            displayedValue={displayedExpectedFlowRate}
                            setDisplayedValue={setDisplayedExpectedFlowRate}
                            setFormattedValue={setExpectedFlowRate}
                            isEther
                            shouldReformat={false}
                            currentBalance={inboundTokenBalance}
                            token={store.inboundToken}
                            setToken={store.setInboundToken}
                            fieldLabel={`${store.inboundToken.label} swap flow-rate`}
                        />
                    </div>
                </div>
                <div>
                    <PricingField
                        refreshingPrice={refreshingPrice}
                        token0Price={token0Price}
                        poolExists={poolExists}
                    />
                    <div
                        className={`transition-all duration-700 overflow-hidden rounded-2xl ${
                            priceImpact > 0.5
                                ? " max-h-64 pt-6 -mb-2 "
                                : " max-h-0 "
                        }`}
                    >
                        <PriceImpactWarning priceImpact={priceImpact} />
                    </div>
                    <div
                        className={`transition-all duration-700 overflow-hidden rounded-2xl ${
                            poolExists && swapFlowRate
                                ? " max-h-64 pt-6 "
                                : " max-h-0 "
                        }`}
                    >
                        <BufferWarning
                            minBalance={minBalance}
                            outboundTokenBalance={outboundTokenBalance}
                            outboundToken={store.outboundToken}
                            buffer={deposit}
                            acceptedBuffer={acceptedBuffer}
                            setAcceptedBuffer={setAcceptedBuffer}
                        />
                    </div>
                </div>
                <TransactionButton
                    title={
                        userToken0Flow.current.gt(0) ? "Update Swap" : "Swap"
                    }
                    loading={loading}
                    onClickFunction={swap}
                    transactionButtonDisabledMessage={getTransactionButtonDisabledMessage()}
                />
            </WidgetContainer>
        </section>
    );
};

export default CreateStreamWidget;

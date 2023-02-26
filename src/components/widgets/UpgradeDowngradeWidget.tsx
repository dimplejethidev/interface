import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { useAccount, useProvider, useSigner } from "wagmi";
import { IoArrowDown } from "react-icons/io5";
import WidgetContainer from "./WidgetContainer";
import { useStore } from "../../store";
import TransactionButton from "../TransactionButton";
import RealTimeBalance from "../RealTimeBalance";
import TokenFlowField from "../TokenFlowField";
import DAIABI from "../../utils/DAIABI.json";
import AqueductTokenABI from "../../utils/AqueductTokenABI.json";
import ReadOnlyFlowOutput from "../ReadOnlyFlowOutput";
import {
    showConnectWalletToast,
    showTransactionConfirmedToast,
} from "../Toasts";
import getErrorToast from "../../utils/getErrorToast";

const DAI_ABI = DAIABI.abi;
const AQUEDUCT_TOKEN_ABI = AqueductTokenABI.abi;

interface CreateStreamWidgetProps {
    setKeyNum: Dispatch<SetStateAction<number>>;
}

const CreateStreamWidget = ({ setKeyNum }: CreateStreamWidgetProps) => {
    const store = useStore();
    const provider = useProvider();
    const { data: rainbowSigner } = useSigner();
    const signer = rainbowSigner as ethers.Signer;
    const { address } = useAccount();

    // amounts for each token
    const [displayedAmount, setDisplayedAmount] = useState<string>("");
    const [amount, setAmount] = useState("");

    // user vars
    const [superTokenBalance, setSuperTokenBalance] = useState(
        BigNumber.from(0)
    );
    const [underlyingTokenBalance, setUnderlyingTokenBalance] = useState(
        BigNumber.from(0)
    );

    // other state
    const [loading, setLoading] = useState(false);
    const [isWrapping, setIsWrapping] = useState(true);

    const upgrade = async () => {
        setLoading(true);
        if (signer === null || signer === undefined) {
            showConnectWalletToast();
            setLoading(false);
            return;
        }

        const underlyingTokenAddress =
            store.upgradeDowngradeToken.underlyingToken?.address;
        const underlyingTokenContract = new ethers.Contract(
            underlyingTokenAddress || "",
            DAI_ABI,
            signer
        );

        const upgradeTokenAddress = store.upgradeDowngradeToken.address;
        const wrappedTokenContract = new ethers.Contract(
            upgradeTokenAddress,
            AQUEDUCT_TOKEN_ABI,
            signer
        );

        let transactionHash;
        try {
            // TODO: Could we use the Superfluid SDK here to get the underlying token?
            const approvedTransaction = await underlyingTokenContract.approve(
                upgradeTokenAddress,
                amount
            );
            transactionHash = approvedTransaction.hash;

            const transactionReceipt = await approvedTransaction.wait();

            showTransactionConfirmedToast(
                "Token spend approved",
                transactionReceipt.transactionHash
            );
        } catch (error) {
            getErrorToast(error, transactionHash);
            setLoading(false);
        }

        try {
            // TODO: Could we use the Superfluid SDK here to upgrade the underlying token?
            const upgradedTransaction = await wrappedTokenContract.upgrade(
                amount,
                { gasLimit: "1000000" }
            );
            transactionHash = upgradedTransaction.hash;
            const transactionReceipt = await upgradedTransaction.wait();

            showTransactionConfirmedToast(
                `Wrapped ${ethers.utils.formatUnits(amount)} ${
                    store.upgradeDowngradeToken.underlyingToken?.label
                }`,
                transactionReceipt.transactionHash
            );
            setLoading(false);

            // clear state after successful transaction
            setKeyNum((k) => k + 1);
        } catch (error) {
            getErrorToast(error, transactionHash);
            setLoading(false);
        }
    };

    const downgrade = async () => {
        setLoading(true);

        if (signer === null || signer === undefined) {
            showConnectWalletToast();
            setLoading(false);
            return;
        }

        const downgradeTokenAddress = store.upgradeDowngradeToken.address;

        const wrappedTokenContract = new ethers.Contract(
            downgradeTokenAddress,
            AQUEDUCT_TOKEN_ABI,
            signer
        );

        let transactionHash;
        try {
            const downgradedTransaction = await wrappedTokenContract.downgrade(
                amount
            );
            transactionHash = downgradedTransaction.hash;
            const transactionReceipt = await downgradedTransaction.wait();
            showTransactionConfirmedToast(
                `Unwrapped ${ethers.utils.formatUnits(amount)} ${
                    store.upgradeDowngradeToken.label
                }`,
                transactionReceipt.transactionHash
            );
            setLoading(false);

            // clear state after successful transaction
            setKeyNum((k) => k + 1);
        } catch (error) {
            getErrorToast(error, transactionHash);
            setLoading(false);
        }
    };

    useEffect(() => {
        async function getBalance() {
            // get balance of underlying token
            const tokenABI = [
                "function balanceOf(address account) public view returns (uint256 balance)",
            ];
            if (
                address &&
                store.upgradeDowngradeToken.underlyingToken?.address
            ) {
                const tokenContract = new ethers.Contract(
                    store.upgradeDowngradeToken.underlyingToken?.address,
                    tokenABI,
                    provider
                );
                setUnderlyingTokenBalance(
                    await tokenContract.balanceOf(address)
                );
            }
        }

        getBalance();
    }, [address, provider, store.upgradeDowngradeToken]);

    function getTransactionButtonDisabledMessage() {
        if (!signer) {
            return "Connect wallet";
        }
        if (!amount || BigNumber.from(amount).lte(0)) {
            return "Enter Amount";
        }
        if (
            (isWrapping && underlyingTokenBalance.lt(amount)) ||
            (!isWrapping && superTokenBalance.lt(amount))
        ) {
            return "Insufficient Balance";
        }
        return undefined;
    }

    return (
        <section className="flex flex-col items-center w-full">
            <RealTimeBalance
                token={store.upgradeDowngradeToken}
                setBalance={setSuperTokenBalance}
            />
            <WidgetContainer
                buttons={[
                    {
                        title: "Wrap",
                        action: () => {
                            setIsWrapping(true);
                        },
                        isSelected: isWrapping,
                    },
                    {
                        title: "Unwrap",
                        action: () => {
                            setIsWrapping(false);
                        },
                        isSelected: !isWrapping,
                    },
                ]}
            >
                <div className="flex flex-col items-center justify-center">
                    <div className="w-full py-1">
                        {store.upgradeDowngradeToken.underlyingToken && (
                            <TokenFlowField
                                displayedValue={displayedAmount}
                                setDisplayedValue={setDisplayedAmount}
                                setFormattedValue={setAmount}
                                isEther
                                isDiscreteAmount
                                currentBalance={
                                    !isWrapping
                                        ? superTokenBalance
                                        : underlyingTokenBalance
                                }
                                token={
                                    !isWrapping
                                        ? store.upgradeDowngradeToken
                                        : store.upgradeDowngradeToken
                                              .underlyingToken
                                }
                                setToken={store.setUpgradeDowngradeToken}
                                isNonSuperToken={isWrapping}
                                fieldLabel={
                                    isWrapping ? "Wrap amount" : "Unwrap amount"
                                }
                            />
                        )}
                    </div>
                    <button
                        type="button"
                        className="flex items-center justify-center w-10 h-10 -my-5 z-10 bg-white rounded-xl border-[1px] centered-shadow-sm dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:centered-shadow-sm-dark"
                        onClick={() => {
                            setIsWrapping(!isWrapping);
                        }}
                    >
                        <IoArrowDown size={20} />
                    </button>
                    <div className="w-full py-1">
                        {store.upgradeDowngradeToken.underlyingToken && (
                            <ReadOnlyFlowOutput
                                displayedValue={displayedAmount}
                                token={
                                    isWrapping
                                        ? store.upgradeDowngradeToken
                                        : store.upgradeDowngradeToken
                                              .underlyingToken
                                }
                            />
                        )}
                    </div>
                </div>
                <TransactionButton
                    title={isWrapping ? "Wrap" : "Unwrap"}
                    loading={loading}
                    onClickFunction={isWrapping ? upgrade : downgrade}
                    transactionButtonDisabledMessage={getTransactionButtonDisabledMessage()}
                />
            </WidgetContainer>
        </section>
    );
};

export default CreateStreamWidget;

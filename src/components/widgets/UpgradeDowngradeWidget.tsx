import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { useAccount, useNetwork, useProvider, useSigner } from "wagmi";
import WidgetContainer from "./WidgetContainer";
import ToastType from "../../types/ToastType";
import { useStore } from "../../store";
import TransactionButton from "../TransactionButton";
import RealTimeBalance from "../RealTimeBalance";
import { IoArrowDown } from "react-icons/io5";
import TokenFlowField from "../TokenFlowField";
import DAIABI from "../../utils/DAIABI.json";
import AqueductTokenABI from "../../utils/AqueductTokenABI.json";
import ReadOnlyFlowOutput from "../ReadOnlyFlowOutput";
import getToastErrorType from "../../utils/getToastErrorType";


const DAI_ABI = DAIABI.abi;
const AQUEDUCT_TOKEN_ABI = AqueductTokenABI.abi;

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

    // amounts for each token
    const [displayedAmount, setDisplayedAmount] = useState<string>('');
    const [amount, setAmount] = useState("");

    // user vars
    const [superTokenBalance, setSuperTokenBalance] = useState(BigNumber.from(0));
    const [underlyingTokenBalance, setUnderlyingTokenBalance] = useState(BigNumber.from(0));

    // other state
    const [loading, setLoading] = useState(false);
    const [isWrapping, setIsWrapping] = useState(true);

    const upgrade = async () => {
        try {
            setLoading(true);

            if (signer == null || signer == undefined) {
                showToast(ToastType.ConnectWallet);
                setLoading(false);
                return;
            }

            // TODO: Could we use the Superfluid SDK here to get the underlying token?
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

            const approvedTransaction = await underlyingTokenContract.approve(
                upgradeTokenAddress,
                amount
            );
            await approvedTransaction.wait();
            console.log("spend approved: ", approvedTransaction);

            // TODO: Could we use the Superfluid SDK here to upgrade the underlying token?
            const upgradedTransaction = await wrappedTokenContract.upgrade(
                amount
            );
            await upgradedTransaction.wait();
            console.log("Upgraded tokens: ", upgradedTransaction);
            showToast(ToastType.Success);
            setLoading(false);
        } catch (error) {
            //console.log("Upgrade error: ", error);
            showToast(getToastErrorType(error));
            setLoading(false);
        }
    };

    const downgrade = async () => {
        try {
            setLoading(true);

            if (signer == null || signer == undefined) {
                showToast(ToastType.ConnectWallet);
                setLoading(false);
                return;
            }

            const downgradeTokenAddress = store.upgradeDowngradeToken.address;

            const wrappedTokenContract = new ethers.Contract(
                downgradeTokenAddress,
                AQUEDUCT_TOKEN_ABI,
                signer
            );

            const downgradedTransaction = await wrappedTokenContract.downgrade(
                amount
            );
            await downgradedTransaction.wait();
            showToast(ToastType.Success);
            setLoading(false);
        } catch (error) {
            console.log("Downgrade error: ", error);
            showToast(ToastType.Error);
            setLoading(false);
        }
    };

    useEffect(() => {
        async function getBalance() {
            // get balance of underlying token
            const tokenABI = [
                "function balanceOf(address account) public view returns (uint256 balance)",
            ];
            if (address && store.upgradeDowngradeToken.underlyingToken?.address) {
                const tokenContract = new ethers.Contract(
                    store.upgradeDowngradeToken.underlyingToken?.address,
                    tokenABI,
                    provider
                );
                setUnderlyingTokenBalance(
                    await tokenContract.balanceOf(address)
                )
            }
        }

        getBalance();
    }, [store.upgradeDowngradeToken])

    return (
        <section className="flex flex-col items-center w-full">
            <RealTimeBalance token={store.upgradeDowngradeToken} setBalance={setSuperTokenBalance} />
            <WidgetContainer buttons={[
                { title: 'Wrap', action: () => { setIsWrapping(true) }, isSelected: isWrapping },
                { title: 'Unwrap', action: () => { setIsWrapping(false) }, isSelected: !isWrapping }
            ]}>
                <div className="flex flex-col items-center justify-center">
                    <div className="w-full py-1">
                        {
                            store.upgradeDowngradeToken.underlyingToken &&
                            <TokenFlowField
                                title="Flow Rate"
                                displayedValue={displayedAmount}
                                setDisplayedValue={setDisplayedAmount}
                                formattedValue={amount}
                                setFormattedValue={setAmount}
                                isEther={true}
                                shouldReformat={true}
                                currentBalance={!isWrapping ? superTokenBalance : underlyingTokenBalance}
                                token={!isWrapping ? store.upgradeDowngradeToken : store.upgradeDowngradeToken.underlyingToken}
                                setToken={store.setUpgradeDowngradeToken}
                                isNonSuperToken={isWrapping}
                            />
                        }
                    </div>
                    <button
                        className="flex items-center justify-center w-10 h-10 bg-white rounded-xl border-[1px] centered-shadow-sm -my-5 z-10"
                        onClick={() => {
                            setIsWrapping(!isWrapping)
                        }}
                    >
                        <IoArrowDown size={20} />
                    </button>
                    <div className="w-full py-1">
                        {
                            store.upgradeDowngradeToken.underlyingToken &&
                            <ReadOnlyFlowOutput
                                displayedValue={displayedAmount}
                                token={isWrapping ? store.upgradeDowngradeToken : store.upgradeDowngradeToken.underlyingToken}
                            />
                        }
                    </div>
                </div>
                <TransactionButton
                    title={isWrapping ? 'Wrap' : 'Unwrap'}
                    loading={loading}
                    onClickFunction={isWrapping ? upgrade : downgrade}
                    errorMessage={
                        !amount || BigNumber.from(amount).lte(0) ? 'Enter Amount' : (
                            (isWrapping && underlyingTokenBalance.lt(amount)) || (!isWrapping && superTokenBalance.lt(amount)) ?
                                'Insufficient Balance'
                                :
                                undefined
                        )
                    }
                />
            </WidgetContainer>
        </section >
    );
};

export default CreateStreamWidget;

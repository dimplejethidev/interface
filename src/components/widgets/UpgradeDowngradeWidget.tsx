import { useState } from "react";
import { BigNumber, ethers } from "ethers";
import { useSigner } from "wagmi";

import NumberEntryField from "../NumberEntryField";
import WidgetContainer from "./WidgetContainer";
import DAIABI from "../../utils/DAIABI.json";
import AqueductTokenABI from "../../utils/AqueductTokenABI.json";
import ToastType from "../../types/ToastType";
import LoadingSpinner from "../LoadingSpinner";
import { useStore } from "../../store";
import TokenDropdown from "../TokenDropdown";
import TransactionButton from "../TransactionButton";

const DAI_ABI = DAIABI.abi;
const AQUEDUCT_TOKEN_ABI = AqueductTokenABI.abi;

interface UpgradeDowngradeWidgetProps {
    showToast: (type: ToastType) => {};
}

const UpgradeDowngradeWidget = ({ showToast }: UpgradeDowngradeWidgetProps) => {
    const { data: rainbowSigner } = useSigner();
    const signer = rainbowSigner as ethers.Signer;
    const store = useStore();

    const [amount, setAmount] = useState("");
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
                store.upgradeDowngradeToken.underlyingToken;
            console.log(underlyingTokenAddress);
            const underlyingTokenContract = new ethers.Contract(
                underlyingTokenAddress || "",
                DAI_ABI,
                signer
            );

            const upgradeTokenAddress = store.upgradeDowngradeToken.address;
            console.log(upgradeTokenAddress);
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
            console.log("Upgrade error: ", error);
            showToast(ToastType.Error);
            setLoading(false);
        }
    };

    const downgrade = async () => {
        try {
            setLoading(true);

            const formattedAmount: BigNumber = ethers.utils.parseUnits(
                amount,
                "ether"
            );

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
                formattedAmount
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

    return (
        <section className="flex flex-col items-center w-full">
            <WidgetContainer buttons={[
                { title: 'Wrap', action: () => { setIsWrapping(true) }, isSelected: isWrapping },
                { title: 'Unwrap', action: () => { setIsWrapping(false) }, isSelected: !isWrapping }
            ]}>
                <div className="space-y-3">
                    <TokenDropdown
                        selectTokenOption={store.upgradeDowngradeToken}
                        setToken={store.setUpgradeDowngradeToken}
                    />
                    <NumberEntryField
                        title={`Enter amount to ${isWrapping ? 'upgrade' : 'downgrade'} here`}
                        number={amount}
                        setNumber={setAmount} 
                        isEther={true}                    
                    />
                </div>
                <TransactionButton 
                    title={isWrapping ? 'Wrap' : 'Unwrap'}
                    loading={loading}
                    onClickFunction={isWrapping ? upgrade : downgrade}
                    errorMessage={!amount || BigNumber.from(amount).lte(0) ? 'Enter Amount' : undefined}
                />
            </WidgetContainer>
        </section>
    );
};

export default UpgradeDowngradeWidget;

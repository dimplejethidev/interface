import { toast } from "react-toastify";
import ToastMessage from "./ToastMessage";

export const showTransactionConfirmedToast = (
    message?: string,
    transactionHash?: string
) => {
    toast.success(
        <ToastMessage message={message} transactionHash={transactionHash} />
    );
};

export const showTransactionFailedToast = () =>
    toast.error("Transaction failed");

export const showGenericErrorToast = () =>
    toast.error("An unexpected error has occured");

export const showConnectWalletToast = () =>
    toast.warning("Please connect a wallet");

export const showNotEnoughEthForGasToast = () =>
    toast.error("ETH balance doesn't cover gas cost");

export const showRejectedTransactionToast = () =>
    toast.success("You rejected the transaction");

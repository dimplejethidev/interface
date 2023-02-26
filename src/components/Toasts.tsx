import { toast } from "react-toastify";
import ToastMessage from "./ToastMessage";

export const showTransactionConfirmedToast = (
    message: string,
    transactionHash?: string
) => {
    toast.success(
        <ToastMessage message={message} transactionHash={transactionHash} />
    );
};

export const showTransactionFailedToast = (
    message: string,
    transactionHash?: string
) => {
    toast.error(
        <ToastMessage message={message} transactionHash={transactionHash} />
    );
};

export const showGenericErrorToast = (
    message = "An unexpected error has occured"
) => {
    toast.error(<ToastMessage message={message} />);
};

export const showConnectWalletToast = () =>
    toast.warning("Please connect a wallet");

export const showNotEnoughEthForGasToast = () =>
    toast.error("ETH balance doesn't cover gas cost");

export const showRejectedTransactionToast = () =>
    toast.success("You rejected the transaction");

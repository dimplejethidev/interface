import { toast } from "react-toastify";

export const showTransactionConfirmedToast = (message?: string) =>
    toast.success(message ?? "Transaction confirmed");

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

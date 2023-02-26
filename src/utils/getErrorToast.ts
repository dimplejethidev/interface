import { SFError } from "@superfluid-finance/sdk-core";
import {
    showRejectedTransactionToast,
    showGenericErrorToast,
    showTransactionFailedToast,
} from "../components/Toasts";

interface ErrorWithCode {
    code: string;
}

interface ErrorWithReason {
    reason: string;
}

interface ErrorWithError {
    error: unknown;
}

function hasErrorCode(errorObject: unknown): errorObject is ErrorWithCode {
    return !!errorObject && !!(errorObject as ErrorWithCode).code;
}

function hasErrorReason(errorObject: unknown): errorObject is ErrorWithReason {
    return !!errorObject && !!(errorObject as ErrorWithReason).reason;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function hasError(errorObject: unknown): errorObject is ErrorWithError {
    return !!errorObject && !!(errorObject as ErrorWithError).error;
}

const getErrorToast = (error: unknown, transactionHash?: string) => {
    // if (error.code === 4001) {
    //     showRejectedTransactionToast();
    // }
    if (transactionHash) {
        if (error instanceof SFError) {
            if (hasErrorCode(error.type)) {
                if (error.type === "UNSUPPORTED_OPERATION") {
                    return showRejectedTransactionToast();
                }

                // Old code. ACTION_REJECTED no longer exists as an error type
                // if (error.errorObject.code == "ACTION_REJECTED") {
                // return ToastType.RejectedTransaction;
                // }
            }

            // TODO: refactor this part too. Had to comment parts out in order to compile the code
            // check specifically if user doesn't have enough ETH for gas
            // this error is buried like 3 levels deep in error objects
            // if (
            //     error instanceof SFError &&
            //     hasError(error.errorObject.errorObject) &&
            //     hasError(error.errorObject.errorObject.error)
            // ) {
            //     if (
            //         hasErrorCode(error.errorObject.errorObject.error.error) &&
            //         error.errorObject.errorObject.error.error.code === "-32000"
            //     ) {
            //         return ToastType.NotEnoughEthForGas;
            //     }
            // }
        }

        return showTransactionFailedToast(
            "Transaction failed",
            transactionHash
        );
    }

    if (hasErrorReason(error)) {
        return showGenericErrorToast(error.reason);
    }

    return showGenericErrorToast();
};

export default getErrorToast;

import { SFError } from "@superfluid-finance/sdk-core";
import {
    showRejectedTransactionToast,
    showGenericErrorToast,
} from "../components/Toasts";

interface ErrorWithCode {
    code: string;
}

interface ErrorWithError {
    error: unknown;
}

function hasErrorCode(errorObject: unknown): errorObject is ErrorWithCode {
    return !!errorObject && !!(errorObject as ErrorWithCode).code;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function hasError(errorObject: unknown): errorObject is ErrorWithError {
    return !!errorObject && !!(errorObject as ErrorWithError).error;
}

const getErrorToast = (error: unknown) => {
    if (error instanceof SFError) {
        if (hasErrorCode(error.type)) {
            if (error.type === "UNSUPPORTED_OPERATION") {
                showRejectedTransactionToast();
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

    showGenericErrorToast();
};

export default getErrorToast;

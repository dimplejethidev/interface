import { SFError } from "@superfluid-finance/sdk-core";
import ToastType from "../types/ToastType";

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

// TODO: refactor this as appears the type definition has changed with the sdk update
const getToastErrorType = (error: unknown): ToastType => {
    // check if error is superfluid error
    if (error instanceof SFError) {
        // check if error has an associated error code
        if (hasErrorCode(error.type)) {
            // user rejected transaction
            if (error.type === "UNSUPPORTED_OPERATION") {
                return ToastType.RejectedTransaction;
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

    // if didn't find a specific error code, return generic error
    return ToastType.Error;
};

export default getToastErrorType;

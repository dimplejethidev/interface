/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable radix */
import { useRouter } from "next/router";
import { createContext, useContext, useState, useEffect } from "react";
import { useAccount } from "wagmi";

const STORE_CONNECTED_WALLET_ID = "tutorial-connectedWallet";
const STORE_REQUESTED_PAY_ID = "tutorial-requestedPay";
const STORE_STARTED_SWAP_ID = "tutorial-startedSwap";

export enum TutorialItemState {
    Incomplete,
    ShowHint,
    Complete,
}

interface TutorialContextInterface {
    connectedWallet: TutorialItemState;
    requestedPay: TutorialItemState;
    startedSwap: TutorialItemState;
    setConnectedWallet: (state: TutorialItemState) => void; // Dispatch<SetStateAction<TutorialItemState>>;
    setRequestedPay: (state: TutorialItemState) => void;
    setStartedSwap: (state: TutorialItemState) => void;
}

const TutorialContext = createContext<TutorialContextInterface | null>(null);

export function useTutorial() {
    return useContext(TutorialContext);
}

const TutorialProvider = ({ children }: { children: JSX.Element }) => {
    // initialize all items as 'incomplete'
    const [connectedWallet, _setConnectedWallet] = useState<TutorialItemState>(
        TutorialItemState.Incomplete
    );
    const [requestedPay, _setRequestedPay] = useState<TutorialItemState>(
        TutorialItemState.Incomplete
    );
    const [startedSwap, _setStartedSwap] = useState<TutorialItemState>(
        TutorialItemState.Incomplete
    );

    // assign state from local storage
    useEffect(() => {
        _setConnectedWallet(
            parseInt(localStorage.getItem(STORE_CONNECTED_WALLET_ID) ?? "0")
        );
        _setRequestedPay(
            parseInt(localStorage.getItem(STORE_REQUESTED_PAY_ID) ?? "0")
        );
        _setStartedSwap(
            parseInt(localStorage.getItem(STORE_STARTED_SWAP_ID) ?? "0")
        );
    }, []);

    // create functions that update state and local storage
    const setConnectedWallet = (state: TutorialItemState) => {
        _setConnectedWallet(state);
        localStorage.setItem(STORE_CONNECTED_WALLET_ID, state.toString());
    };
    const setRequestedPay = (state: TutorialItemState) => {
        _setRequestedPay(state);
        localStorage.setItem(STORE_REQUESTED_PAY_ID, state.toString());
    };
    const setStartedSwap = (state: TutorialItemState) => {
        _setStartedSwap(state);
        localStorage.setItem(STORE_STARTED_SWAP_ID, state.toString());
    };

    // detect if wallet has connected
    const { isConnected } = useAccount();
    useEffect(() => {
        if (isConnected) {
            setConnectedWallet(TutorialItemState.Complete);
        }
    }, [isConnected]);

    // reroute to swap page if showing that hint
    const router = useRouter();
    useEffect(() => {
        if (startedSwap === TutorialItemState.ShowHint) {
            router.push("/");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startedSwap]);

    // TODO: Assess whether we should add useMemo here
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    return (
        <TutorialContext.Provider
            // eslint-disable-next-line react/jsx-no-constructed-context-values
            value={{
                connectedWallet,
                requestedPay,
                startedSwap,
                setConnectedWallet,
                setRequestedPay,
                setStartedSwap,
            }}
        >
            {children}
        </TutorialContext.Provider>
    );
};

export default TutorialProvider;

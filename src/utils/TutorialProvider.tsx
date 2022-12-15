import { useRouter } from "next/router";
import { createContext, useContext, Dispatch, SetStateAction, useState, useEffect } from "react";
import { useAccount } from "wagmi";

export enum TutorialItemState {
    Incomplete,
    ShowHint,
    Complete
}

interface TutorialContextInterface {
    connectedWallet: TutorialItemState;
    requestedPay: TutorialItemState;
    startedSwap: TutorialItemState;
    setConnectedWallet: Dispatch<SetStateAction<TutorialItemState>>;
    setRequestedPay: Dispatch<SetStateAction<TutorialItemState>>;
    setStartedSwap: Dispatch<SetStateAction<TutorialItemState>>;
}

const TutorialContext = createContext<TutorialContextInterface | null>(null);

export function useTutorial() {
    return useContext(TutorialContext);
}

const TutorialProvider = ({ children }: { children: JSX.Element }) => {
    const [connectedWallet, setConnectedWallet] = useState(TutorialItemState.Incomplete);
    const [requestedPay, setRequestedPay] = useState(TutorialItemState.Incomplete);
    const [startedSwap, setStartedSwap] = useState(TutorialItemState.Incomplete);

    // detect if wallet has connected
    const { isConnected } = useAccount();
    useEffect(() => {
        if (isConnected) {
            setConnectedWallet(TutorialItemState.Complete);
        }
    }, [isConnected])

    // reroute to swap page if showing that hint
    const router = useRouter();
    useEffect(() => {
        if (startedSwap == TutorialItemState.ShowHint) {
            router.push('/')
        }
    }, [startedSwap])

    // TODO: Assess whether we should add useMemo here
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    return (
        <TutorialContext.Provider value={{
            connectedWallet,
            requestedPay,
            startedSwap,
            setConnectedWallet,
            setRequestedPay,
            setStartedSwap
        }}>
            {children}
        </TutorialContext.Provider >
    )
};

export default TutorialProvider;

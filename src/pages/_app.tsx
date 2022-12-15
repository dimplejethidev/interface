import type { AppProps } from "next/app";
import { SetStateAction, useEffect, useState } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import {
    getDefaultWallets,
    RainbowKitProvider,
    lightTheme,
    darkTheme,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { useRouter } from "next/router";

import "../styles/globals.css";
import CustomAvatar from "../components/CustomAvatar";
import ToastType from "../types/ToastType";
import ToastMessage from "../components/ToastMessage";
import IToast from "../types/Toast";
import Sidebar from "../components/Sidebar";
import DarkModeProvider from "../utils/DarkModeProvider";
import TutorialChecklistPopup from "../components/TutorialChecklistPopup";
import TutorialProvider from "../utils/TutorialProvider";

const { chains, provider } = configureChains(
    [chain.goerli],
    [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY ?? "" })]
);

const { connectors } = getDefaultWallets({
    appName: "Aqueduct",
    chains,
});

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
});

const MyApp = ({ Component, pageProps }: AppProps) => {
    const [toastList, setToastList] = useState<IToast[]>([]);
    let toast: IToast;

    const showToast = (type: ToastType) => {
        switch (type) {
            case ToastType.Success:
                toast = {
                    id: toastList.length + 1,
                    title: "Success",
                    description: "Transaction Confirmed",
                    backgroundColor: "#5cb85c",
                };
                break;
            case ToastType.Error:
                toast = {
                    id: toastList.length + 1,
                    title: "Error",
                    description: "An unexpected error has occured",
                    backgroundColor: "#d9534f",
                };
                break;
            case ToastType.Warning:
                toast = {
                    id: toastList.length + 1,
                    title: "Warning",
                    description: "This is a warning toast component",
                    backgroundColor: "#f0ed4e",
                };
                break;
            case ToastType.Info:
                toast = {
                    id: toastList.length + 1,
                    title: "Info",
                    description: "This is a info toast component",
                    backgroundColor: "#5bc0de",
                };
                break;
            case ToastType.ConnectWallet:
                toast = {
                    id: toastList.length + 1,
                    title: "Error",
                    description: "Please connect a wallet.",
                    backgroundColor: "#FDB833",
                };
                break;
            case ToastType.NotEnoughEthForGas:
                toast = {
                    id: toastList.length + 1,
                    title: "Error",
                    description: "ETH balance doesn't cover gas cost",
                    backgroundColor: "#d9534f",
                };
                break;
            case ToastType.RejectedTransaction:
                toast = {
                    id: toastList.length + 1,
                    title: "Error",
                    description: "You rejected the transaction",
                    backgroundColor: "#d9534f",
                };
                break;
            default:
                toast = {
                    id: toastList.length + 1,
                    title: "IToast message error",
                    description: "An unexpected error has occured",
                    backgroundColor: "#d9534f",
                };
        }

        setToastList([...toastList, toast]);
    };

    const [isShown, setIsShown] = useState(false);
    const router = useRouter();

    // dark mode params
    const [isDark, setIsDark] = useState<boolean>(false);
    useEffect(() => {
        const dark = document.documentElement.classList.contains("dark");
        setIsDark(dark);

        if (dark) {
            document.body.style.background = '#000000'
        }
    }, [setIsDark]);

    return (
        <div>
            {router.pathname === "/landing" ? (
                // eslint-disable-next-line react/jsx-props-no-spreading
                <Component {...pageProps} />
            ) : (
                <WagmiConfig client={wagmiClient}>
                    <DarkModeProvider isDark={isDark} setIsDark={setIsDark}>
                        <RainbowKitProvider
                            chains={chains}
                            theme={
                                isDark
                                    ? darkTheme({ accentColor: "#2662CB" })
                                    : lightTheme({ accentColor: "#2662CB" })
                            }
                            avatar={CustomAvatar}
                        >
                            <TutorialProvider>
                                <div className="w-full h-screen text-slate-500 poppins-font bg-white dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-blueBlack dark:to-black">
                                    <div className="flex flex-col md:flex-row h-full items-center md:items-stretch">
                                        <div className="w-full md:w-auto md:p-4">
                                            <Sidebar
                                                isShown={isShown}
                                                setIsShown={setIsShown}
                                            />
                                        </div>
                                        <main
                                            className={`flex flex-col items-center space-y-4 md:space-y-16 px-4 w-full overflow-y-scroll ${isShown && " hidden md:flex "
                                                }`}
                                        >
                                            <div className="md:h-[50%]" />
                                            <Component
                                                // eslint-disable-next-line react/jsx-props-no-spreading
                                                {...pageProps}
                                                showToast={showToast}
                                            />
                                            <div className="md:h-[50%]" />
                                        </main>
                                    </div>
                                    <ToastMessage
                                        toastList={toastList}
                                        setToastList={setToastList}
                                    />
                                    <TutorialChecklistPopup />
                                </div>
                            </TutorialProvider>
                        </RainbowKitProvider>
                    </DarkModeProvider>
                </WagmiConfig>
            )}
        </div>
    );
};

export default MyApp;

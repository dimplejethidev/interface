import type { AppProps } from "next/app";
import { useState } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import {
    getDefaultWallets,
    RainbowKitProvider,
    lightTheme,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

import "../styles/globals.css";
import CustomAvatar from "../components/CustomAvatar";
import ToastType from "../types/ToastType";
import ToastMessage from "../components/ToastMessage";
import IToast from "../types/Toast";

const { chains, provider } = configureChains(
    [chain.goerli],
    [publicProvider()]
);

const { connectors } = getDefaultWallets({
    appName: "My RainbowKit App",
    chains,
});

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
});

function MyApp({ Component, pageProps }: AppProps) {
    const [toastList, setToastList] = useState<IToast[]>([]);
    let toast: IToast;

    const showToast = (type: ToastType) => {
        switch (type) {
            case ToastType.Success:
                toast = {
                    id: toastList.length + 1,
                    title: "Success",
                    description: "Success message",
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

    return (
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider
                chains={chains}
                theme={lightTheme({ accentColor: "#2662CB" })}
                avatar={CustomAvatar}
            >
                <div className="w-full h-screen text-slate-500 poppins-font">
                    <Component {...pageProps} showToast={showToast} />
                    <ToastMessage
                        toastList={toastList}
                        setToastList={setToastList}
                    />
                </div>
            </RainbowKitProvider>
        </WagmiConfig>
    );
}

export default MyApp;

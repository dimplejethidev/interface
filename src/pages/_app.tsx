import type { AppProps } from "next/app";
import { useState, useEffect } from "react";

import "../styles/globals.css";
import { BalanceProvider } from "../context/balanceContext";
import ToastType from "../types/toastType";
import ToastMessage from "../components/ToastMessage";
import { Toast } from "../types/Toast";

declare var window: any; // so that we can access ethereum object - TODO: add interface to more gracefully solve this

function MyApp({ Component, pageProps }: AppProps) {
    const [account, setAccount] = useState("");
    const [list, setList] = useState<Toast[]>([]);
    let toastProperties: Toast;

    const tailwindGradient =
        "bg-gradient-to-t from-gray-200 via-gray-400 to-gray-600";

    const showToast = (type: ToastType) => {
        switch (type) {
            case ToastType.Success:
                toastProperties = {
                    id: list.length + 1,
                    title: "Success",
                    description: "Success message",
                    backgroundColor: "#5cb85c",
                };
                break;
            case ToastType.Error:
                toastProperties = {
                    id: list.length + 1,
                    title: "Error",
                    description: "An unexpected error has occured",
                    backgroundColor: "#d9534f",
                };
                break;
            case ToastType.Warning:
                toastProperties = {
                    id: list.length + 1,
                    title: "Warning",
                    description: "This is a warning toast component",
                    backgroundColor: "#f0ed4e",
                };
                break;
            case ToastType.Info:
                toastProperties = {
                    id: list.length + 1,
                    title: "Info",
                    description: "This is a info toast component",
                    backgroundColor: "#5bc0de",
                };
                break;
            default:
                toastProperties = {
                    id: list.length + 1,
                    title: "Toast message error",
                    description: "An unexpected error has occured",
                    backgroundColor: "#d9534f",
                };
        }

        setList([...list, toastProperties]);
    };

    const connectWallet = async () => {
        const { ethereum } = window;
        if (!ethereum) {
            console.log("Ethereum object not found");
            showToast(ToastType.Error);
            return;
        }

        try {
            const accounts = await ethereum.request({
                method: "eth_requostAccounts",
            });

            setAccount(accounts[0]);
        } catch (error) {
            console.log("Error: ", error);
            showToast(ToastType.Error);
        }
    };

    useEffect(() => {
        connectWallet();
    }, []);

    return (
        <div className={`w-full h-screen text-white ${tailwindGradient}`}>
            <BalanceProvider>
                <Component {...pageProps} account={account} />
                <ToastMessage
                    toastList={list}
                    position="button-right"
                    setList={setList}
                />
            </BalanceProvider>
        </div>
    );
}

export default MyApp;

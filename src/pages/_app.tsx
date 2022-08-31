import type { AppProps } from "next/app";
import { useState, useEffect } from "react";

import "../styles/globals.css";
import { BalanceProvider } from "../context/balanceContext";
import ToastType from "../types/toastType";
import ToastMessage from "../components/ToastMessage";
import { Toast } from "../types/Toast";
import { useStore } from "../store";

declare var window: any; // so that we can access ethereum object - TODO: add interface to more gracefully solve this

function MyApp({ Component, pageProps }: AppProps) {
    const store = useStore();
    const [toastList, setToastList] = useState<Toast[]>([]);
    let toast: Toast;

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
            default:
                toast = {
                    id: toastList.length + 1,
                    title: "Toast message error",
                    description: "An unexpected error has occured",
                    backgroundColor: "#d9534f",
                };
        }

        setToastList([...toastList, toast]);
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
                method: "eth_requestAccounts",
            });

            store.setAccount(accounts[0]);
        } catch (error) {
            console.log("Error: ", error);
            showToast(ToastType.Error);
        }
    };

    useEffect(() => {
        connectWallet();
    }, []);

    return (
        <div className="w-full h-screen text-slate-500 bg-gradient-to-t from-sky-400 to-blue-500">
            <BalanceProvider>
                {store.account ? (
                    <Component {...pageProps} showToast={showToast} />
                ) : (
                    <div className="h-full w-full flex justify-center items-center">
                        <button
                            onClick={connectWallet}
                            className="w-100 h-12 p-2 border-none rounded-2xl bg-gradient-to-r from-sky-400 to-blue-500"
                        >
                            Connect Wallet
                        </button>
                    </div>
                )}
                <ToastMessage
                    toastList={toastList}
                    position="button-right"
                    setToastList={setToastList}
                />
            </BalanceProvider>
        </div>
    );
}

export default MyApp;

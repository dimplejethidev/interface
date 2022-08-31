import type { AppProps } from "next/app";
import { useState, useEffect } from "react";

import "../styles/globals.css";
import { BalanceProvider } from "../context/balanceContext";
import ToastType from "../types/toastType";
import ToastMessage from "../components/ToastMessage";
import { Toast } from "../types/Toast";

import Image from "next/image";
import logo from "./../../public/aqueduct-logo.png";

declare var window: any; // so that we can access ethereum object - TODO: add interface to more gracefully solve this

function MyApp({ Component, pageProps }: AppProps) {
    const [account, setAccount] = useState("");
    const [list, setList] = useState<Toast[]>([]);
    let toastProperties: Toast;

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
                method: "eth_requestAccounts",
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
        <div className="w-full h-screen text-slate-500">
            <BalanceProvider>
                {account ? (
                    <Component
                        {...pageProps}
                        account={account}
                        showToast={showToast}
                    />
                ) : (
                    <div className="flex flex-col h-full w-full p-4">
                        <div className="flex items-center space-x-2 text-aqueductBlue">
                            <Image
                                src={logo}
                                alt="Aqueduct logo"
                                layout="fixed"
                                width="45px"
                                height="45px"
                                className="rounded-xl"
                            />
                            <h1 className="text-2xl font-bold pr-3">Aqueduct</h1>
                        </div>
                        <div className="h-full w-full flex justify-center items-center">
                            <button
                                onClick={connectWallet}
                                className="w-100 h-12 px-6 border-none rounded-2xl bg-aqueductBlue/90 text-white"
                            >
                                Connect Wallet
                            </button>
                        </div>
                    </div>
                )}
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

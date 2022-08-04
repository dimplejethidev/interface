import type { AppProps } from "next/app";
import { useState, useEffect } from "react";

import "../styles/globals.css";
import { BalanceProvider } from "../context/balanceContext";

declare var window: any; // so that we can access ethereum object - TODO: add interface to more gracefully solve this

function MyApp({ Component, pageProps }: AppProps) {
    const [account, setAccount] = useState("");

    const tailwindGradient =
        "bg-gradient-to-t from-gray-200 via-gray-400 to-gray-600";

    const connectWallet = async () => {
        const { ethereum } = window;
        if (!ethereum) {
            console.log("Ethereum object not found");
        }

        try {
            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });

            setAccount(accounts[0]);
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    useEffect(() => {
        connectWallet();
    }, []);

    return (
        <div className={`w-full h-screen text-white ${tailwindGradient}`}>
            <BalanceProvider>
                <Component {...pageProps} account={account} />
            </BalanceProvider>
        </div>
    );
}

export default MyApp;

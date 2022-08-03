import type { AppProps } from "next/app";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";

import "../styles/globals.css";

declare var window: any; // so that we can access ethereum object - TODO: add interface to more gracefully solve this

function MyApp({ Component, pageProps }: AppProps) {
    const [account, setAccount] = useState("");
    const [balanceWei, setBalanceWei] = useState("");
    const [balanceTimestamp, setBalanceTimestamp] = useState<number>();
    const [flowRateWei, setFlowRateWei] = useState("");

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

    const getFlowInfo = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const chainId = await window.ethereum.request({
            method: "eth_chainId",
        });
        const superfluid = await Framework.create({
            chainId: Number(chainId),
            provider: provider,
        });

        const accountFlowInfo = await superfluid.cfaV1.getAccountFlowInfo({
            superToken: "0x6130677802D32e430c72DbFdaf90d6d058137f0F", // gets the opposite token to the one I swapped. TODO: this needs to be dynamic
            account: account,
            providerOrSigner: provider,
        });
        console.log("Account flow info: ", accountFlowInfo);

        const unixTimestamp = accountFlowInfo.timestamp.getTime() / 1000;
        setBalanceWei(accountFlowInfo.deposit);
        setBalanceTimestamp(unixTimestamp);
        setFlowRateWei(accountFlowInfo.flowRate);
    };

    useEffect(() => {
        connectWallet();
    }, []);

    useEffect(() => {
        getFlowInfo();
    }, [account]);

    return (
        <div className={`w-full h-screen text-white ${tailwindGradient}`}>
            <Component {...pageProps} />
        </div>
    );
}

export default MyApp;

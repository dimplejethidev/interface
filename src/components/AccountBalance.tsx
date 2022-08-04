import { useEffect } from "react";
import { ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";

import FlowingBalance from "./FlowingBalance";
import { useBalance } from "../context/balanceContext";

declare var window: any; // so that we can access ethereum object - TODO: add interface to more gracefully solve this

interface AccountBalanceProps {
    account: string;
}

const AccountBalance = ({ account }: AccountBalanceProps) => {
    const { balance, updateBalance } = useBalance();

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
        updateBalance({
            balanceWei: accountFlowInfo.deposit,
            balanceTimestamp: unixTimestamp,
            flowRateWei: accountFlowInfo.flowRate,
        });
    };

    useEffect(() => {
        getFlowInfo();
    }, [account]);

    return (
        <FlowingBalance
            balance={balance.balanceWei}
            balanceTimestamp={balance.balanceTimestamp}
            flowRate={balance.flowRateWei}
        />
    );
};

export default AccountBalance;

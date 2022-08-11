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
            superToken: "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00", // TODO: this needs to be dynamic
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

    // TODO: loop over user pool interactions and display each stream here
    return (
        <div className="flex flex-col justify-start items-center w-full max-w-lg mt-12 pt-4 pb-8 space-y-2 rounded-3xl bg-gray-800">
            <h3>Swaps</h3>
            <FlowingBalance
                balance={balance.balanceWei}
                balanceTimestamp={balance.balanceTimestamp}
                flowRate={balance.flowRateWei}
            />
        </div>
    );
};

export default AccountBalance;

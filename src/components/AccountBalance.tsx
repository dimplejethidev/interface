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
            superToken: "0xC0645f9306d5c26E2b890e87DF2Fb40Eaf122E56", // TODO: this needs to be dynamic
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
    }, []);

    // TODO: loop over user pool interactions and display each stream here
    return (
        <section className="flex flex-col items-center w-full mt-12">
            <div className="flex flex-col w-full max-w-lg pt-4 pb-8 space-y-2 rounded-3xl bg-white">
                <p className="flex font-bold pb-2 pl-3">Swaps</p>
                {balance.balanceWei &&
                balance.balanceTimestamp &&
                balance.flowRateWei ? (
                    <FlowingBalance
                        balance={balance.balanceWei}
                        balanceTimestamp={balance.balanceTimestamp}
                        flowRate={balance.flowRateWei}
                    />
                ) : (
                    <p className="pl-3">No swaps in progress</p>
                )}
            </div>
        </section>
    );
};

export default AccountBalance;

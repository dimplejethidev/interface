import type { NextPage } from "next";
import { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";

import FlowingBalance from "../components/FlowingBalance";
import CreateStreamWidget from "../components/widgets/CreateStreamWidget";
import UpgradeWidget from "../components/widgets/UpgradeWidget";
import DowngradeWidget from "../components/widgets/DowngradeWidget";

declare var window: any; // so that we can access ethereum object - TODO: add interface to more gracefully solve this

const Dashboard: NextPage = () => {
    const [account, setAccount] = useState("");
    const [balanceWei, setBalanceWei] = useState("");
    const [balanceTimestamp, setBalanceTimestamp] = useState<number>();
    const [flowRateWei, setFlowRateWei] = useState("");

    return (
        <main className="flex flex-col items-center h-full text-white">
            {balanceWei && balanceTimestamp && flowRateWei && (
                <FlowingBalance
                    balance={balanceWei}
                    balanceTimestamp={balanceTimestamp}
                    flowRate={flowRateWei}
                />
            )}
        </main>
    );
};

export default Dashboard;

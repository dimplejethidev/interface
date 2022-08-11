import type { NextPage } from "next";
import "tailwindcss/tailwind.css";
import AccountBalance from "../components/AccountBalance";

import Header from "../components/Header";
import CreateStreamWidget from "../components/widgets/CreateStreamWidget";
import ToastType from "../types/toastType";

interface SwapProps {
    account: string;
    showToast: (type: ToastType) => {};
}

const Swap: NextPage<SwapProps> = ({ account, showToast }) => {
    return (
        <div className="flex  flex-col items-center">
            <Header account={account} />
            <CreateStreamWidget showToast={showToast} />
            <AccountBalance account={account} />
        </div>
    );
};

export default Swap;

import type { NextPage } from "next";
import "tailwindcss/tailwind.css";

import Header from "../components/Header";
import CreateStreamWidget from "../components/widgets/CreateStreamWidget";
import AccountBalance from "../components/AccountBalance";
import ToastType from "../types/toastType";

interface SwapProps {
    account: string;
    showToast: (type: ToastType) => {};
}

const Swap: NextPage<SwapProps> = ({ account, showToast }) => {
    return (
        <div className="flex flex-col items-center">
            <Header account={account} />
            <main className="flex flex-col w-4/5 justify-evenly">
                <CreateStreamWidget showToast={showToast} />
                <AccountBalance account={account} />
            </main>
        </div>
    );
};

export default Swap;

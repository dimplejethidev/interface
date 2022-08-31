import type { NextPage } from "next";
import "tailwindcss/tailwind.css";

import Header from "../components/Header";
import CreateStreamWidget from "../components/widgets/CreateStreamWidget";
import AccountBalance from "../components/AccountBalance";
import ToastType from "../types/ToastType";

interface SwapProps {
    showToast: (type: ToastType) => {};
}

const Swap: NextPage<SwapProps> = ({ showToast }) => {
    return (
        <div className="flex flex-col items-center">
            <Header />
            <main className="flex flex-col w-4/5 justify-evenly">
                <CreateStreamWidget showToast={showToast} />
                <AccountBalance />
            </main>
        </div>
    );
};

export default Swap;

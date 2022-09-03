import type { NextPage } from "next";
import "tailwindcss/tailwind.css";

import Sidebar from "../components/Sidebar";
import CreateStreamWidget from "../components/widgets/CreateStreamWidget";
import AccountBalance from "../components/AccountBalance";
import ToastType from "../types/ToastType";

interface SwapProps {
    showToast: (type: ToastType) => {};
}

const Swap: NextPage<SwapProps> = ({ showToast }) => {
    return (
        <div className="flex items-center">
            <Sidebar />
            <main className="flex flex-col w-4/5 justify-evenly">
                <CreateStreamWidget showToast={showToast} />
                <AccountBalance />
            </main>
        </div>
    );
};

export default Swap;

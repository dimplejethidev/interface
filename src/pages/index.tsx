import type { NextPage } from "next";
import "tailwindcss/tailwind.css";

import Header from "../components/Header";
import CreateStreamWidget from "../components/widgets/CreateStreamWidget";
import ToastType from "../types/toastType";

interface SwapProps {
    account: string;
    showToast: (type: ToastType) => {};
}

const Swap: NextPage<SwapProps> = ({ account, showToast }) => {
    return (
        <div>
            <Header account={account} />
            <CreateStreamWidget showToast={showToast} />
        </div>
    );
};

export default Swap;

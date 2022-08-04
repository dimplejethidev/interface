import type { NextPage } from "next";
import "tailwindcss/tailwind.css";

import Header from "../components/Header";
import CreateStreamWidget from "../components/widgets/CreateStreamWidget";

interface SwapProps {
    account: string;
}

const Swap: NextPage<SwapProps> = ({ account }) => {
    return (
        <div>
            <Header account={account} />
            <CreateStreamWidget />
        </div>
    );
};

export default Swap;

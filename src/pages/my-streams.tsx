import type { NextPage } from "next";
import Sidebar from "../components/Sidebar";
import RealTimeFlowingBalance from "../components/RealTimeFlowingBalance";
import { useState } from "react";

const MyStreams: NextPage = () => {
    const [isShown, setIsShown] = useState(false);

    return (
        <div className="flex flex-col md:flex-row h-full items-center md:items-stretch">
            <Sidebar isShown={isShown} setIsShown={setIsShown} />
            <main className="flex flex-col w-4/5 justify-evenly py-12 md:py-0">
                <RealTimeFlowingBalance />
            </main>
        </div>
    );
};

export default MyStreams;

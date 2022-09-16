import type { NextPage } from "next";
import Sidebar from "../components/Sidebar";
import RealTimeFlowingRewards from "../components/RealTimeFlowingRewards";
import { useState } from "react";

const MyRewards: NextPage = () => {
    const [isShown, setIsShown] = useState(false);

    return (
        <div className="flex flex-col md:flex-row h-full items-center md:items-stretch">
            <Sidebar isShown={isShown} setIsShown={setIsShown} />
            <main className="flex flex-col w-4/5 justify-evenly py-12 md:py-0">
                <RealTimeFlowingRewards />
            </main>
        </div>
    );
};

export default MyRewards;

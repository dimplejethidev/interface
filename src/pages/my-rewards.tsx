import type { NextPage } from "next";
import Sidebar from "../components/Sidebar";
import RealTimeFlowingRewards from "../components/RealTimeFlowingRewards";

const MyRewards: NextPage = () => {
    return (
        <div className="flex items-center">
            <Sidebar />
            <main className="flex flex-col w-4/5 justify-evenly">
                <RealTimeFlowingRewards />
            </main>
        </div>
    );
};

export default MyRewards;

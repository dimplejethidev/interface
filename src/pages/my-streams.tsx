import type { NextPage } from "next";
import Sidebar from "../components/Sidebar";
import RealTimeFlowingBalance from "../components/RealTimeFlowingBalance";

const MyStreams: NextPage = () => {
    return (
        <div className="flex items-center">
            <Sidebar />
            <main className="flex flex-col w-4/5 justify-evenly">
                <RealTimeFlowingBalance />
            </main>
        </div>
    );
};

export default MyStreams;

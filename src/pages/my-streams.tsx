import type { NextPage } from "next";
import Dropdown from "../components/Dropdown";
import Token from "../types/Token";
import Sidebar from "../components/Sidebar";
import WidgetContainer from "../components/widgets/WidgetContainer";
import { useStore } from "../store";
import RealTimeFlowingBalance from "../components/RealTimeFlowingBalance";
import { ethers } from "ethers";

const MyStreams: NextPage = () => {
    return (
        <div className="flex items-center">
            <Sidebar />
            <main className="flex flex-col w-4/5 justify-evenly">
                <RealTimeFlowingBalance />
            </main>
        </div>
    );
}

export default MyStreams;
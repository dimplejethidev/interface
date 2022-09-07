import type { NextPage } from "next";
import Dropdown from "../components/Dropdown";
import Token from "../types/Token";
import Sidebar from "../components/Sidebar";
import WidgetContainer from "../components/widgets/WidgetContainer";
import { useStore } from "../store";
import RealTimeFlowingBalance from "../components/RealTimeFlowingBalance";
import { ethers } from "ethers";

const ProvideLiquidity: NextPage = () => {
    const store = useStore();

    return (
        <div className="flex items-start">
            <Sidebar />
            <main className="flex flex-col w-4/5 justify-evenly p-20 space-y-32">
                <div className="flex items-center space-x-4">
                    <div className="flex font-semibold px-4 py-2 rounded-xl text-lg whitespace-nowrap text-aqueductBlue bg-aqueductBlue/10 w-min">My Streams</div>
                    <div className="flex grow" />
                    <div className="w-44">
                        <Dropdown
                            title='Token'
                            dropdownItems={[Token.fDAIxp, Token.fUSDCxp]}
                            setToken={store.setSelectedToken}
                        />
                    </div>
                </div>
                <RealTimeFlowingBalance />
            </main>
        </div>
    );
};

export default ProvideLiquidity;

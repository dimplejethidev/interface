import type { NextPage } from "next";
import Sidebar from "../components/Sidebar";
import ProvideLiquidityWidget from "../components/widgets/ProvideLiquidityWidget";
import WidgetContainer from "../components/widgets/WidgetContainer";
import ToastType from "../types/ToastType";

interface ProvideLiquidityProps {
    showToast: (type: ToastType) => {};
}

const ProvideLiquidity: NextPage<ProvideLiquidityProps> = ({ showToast }) => {
    return (
        <div className="flex items-center">
            <Sidebar />
            <main className="flex flex-col w-4/5 justify-evenly">
                <ProvideLiquidityWidget showToast={showToast} />
            </main>
        </div>
    );
};

export default ProvideLiquidity;

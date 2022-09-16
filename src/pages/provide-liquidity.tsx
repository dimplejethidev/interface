import type { NextPage } from "next";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ProvideLiquidityWidget from "../components/widgets/ProvideLiquidityWidget";
import ToastType from "../types/ToastType";

interface ProvideLiquidityProps {
    showToast: (type: ToastType) => {};
}

const ProvideLiquidity: NextPage<ProvideLiquidityProps> = ({ showToast }) => {
    const [isShown, setIsShown] = useState(false);

    return (
        <div className="flex flex-col md:flex-row h-full items-center md:items-stretch">
            <Sidebar isShown={isShown} setIsShown={setIsShown} />
            <main className="flex flex-col w-4/5 justify-evenly py-12 md:py-0">
                <ProvideLiquidityWidget showToast={showToast} />
            </main>
        </div>
    );
};

export default ProvideLiquidity;

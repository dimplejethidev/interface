import type { NextPage } from "next";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ProvideLiquidityWidget from "../components/widgets/ProvideLiquidityWidget";
import ToastType from "../types/ToastType";

interface ProvideLiquidityProps {
    showToast: (type: ToastType) => {};
}

const ProvideLiquidity: NextPage<ProvideLiquidityProps> = ({ showToast }) => {
    return (
        <ProvideLiquidityWidget showToast={showToast} />
    );
};

export default ProvideLiquidity;

import type { NextPage } from "next";
import { useState } from "react";
import "tailwindcss/tailwind.css";

import Sidebar from "../components/Sidebar";
import CreateStreamWidget from "../components/widgets/CreateStreamWidget";
import ToastType from "../types/ToastType";

interface SwapProps {
    showToast: (type: ToastType) => {};
}

const Swap: NextPage<SwapProps> = ({ showToast }) => {
    return (
        <CreateStreamWidget showToast={showToast} />
    );
};

export default Swap;

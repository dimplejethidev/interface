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
    const [isShown, setIsShown] = useState(false);

    return (
        <div className="flex flex-col md:flex-row h-full items-center md:items-stretch">
            <Sidebar isShown={isShown} setIsShown={setIsShown} />
            <main 
                className={
                    "flex flex-col w-4/5 justify-evenly py-12 md:py-0 "
                    + (isShown && "hidden md:flex")
                }
            >
                <CreateStreamWidget showToast={showToast} />
            </main>
        </div>
    );
};

export default Swap;

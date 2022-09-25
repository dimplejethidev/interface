import type { NextPage } from "next";
import { useState } from "react";
import Sidebar from "../components/Sidebar";

import DowngradeWidget from "../components/widgets/DowngradeWidget";
import UpgradeDowngradeWidget from "../components/widgets/UpgradeDowngradeWidget";
import ToastType from "../types/ToastType";

interface WrapProps {
    showToast: (type: ToastType) => {};
}

const Wrap: NextPage<WrapProps> = ({ showToast }) => {
    const [isShown, setIsShown] = useState(false);

    return (
        <div className="flex flex-col md:flex-row h-full items-center md:items-stretch">
            <Sidebar isShown={isShown} setIsShown={setIsShown} />
            <main className="flex flex-col w-4/5 justify-center py-12 md:py-0">
                <UpgradeDowngradeWidget showToast={showToast} />
            </main>
        </div>
    );
}

export default Wrap;

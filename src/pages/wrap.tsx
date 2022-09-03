import type { NextPage } from "next";
import Sidebar from "../components/Sidebar";

import DowngradeWidget from "../components/widgets/DowngradeWidget";
import UpgradeWidget from "../components/widgets/UpgradeWidget";
import ToastType from "../types/ToastType";

interface UpgradeProps {
    showToast: (type: ToastType) => {};
}

const Upgrade: NextPage<UpgradeProps> = ({ showToast }) => (
    <div className="flex items-center">
        <Sidebar />
        <main className="flex flex-col w-4/5 justify-evenly">
            <UpgradeWidget showToast={showToast} />
            <DowngradeWidget showToast={showToast} />
        </main>
    </div>
);

export default Upgrade;

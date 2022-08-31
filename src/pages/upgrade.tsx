import type { NextPage } from "next";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import UpgradeWidget from "../components/widgets/UpgradeWidget";
import ToastType from "../types/toastType";

interface UpgradeProps {
    account: string;
    showToast: (type: ToastType) => {};
}

const Upgrade: NextPage<UpgradeProps> = ({ account, showToast }) => (
    <div className="flex items-center">
        <Sidebar account={account} />
        <UpgradeWidget showToast={showToast} />
    </div>
);

export default Upgrade;

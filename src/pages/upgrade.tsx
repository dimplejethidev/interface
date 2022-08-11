import type { NextPage } from "next";
import Header from "../components/Header";
import UpgradeWidget from "../components/widgets/UpgradeWidget";
import ToastType from "../types/toastType";

interface UpgradeProps {
    account: string;
    showToast: (type: ToastType) => {};
}

const Upgrade: NextPage<UpgradeProps> = ({ account, showToast }) => (
    <div>
        <Header account={account} />
        <UpgradeWidget showToast={showToast} />
    </div>
);

export default Upgrade;

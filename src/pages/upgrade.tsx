import type { NextPage } from "next";
import Header from "../components/Header";
import UpgradeWidget from "../components/widgets/UpgradeWidget";
import ToastType from "../types/toastType";

interface UpgradeProps {
    showToast: (type: ToastType) => {};
}

const Upgrade: NextPage<UpgradeProps> = ({ showToast }) => (
    <div>
        <Header />
        <UpgradeWidget showToast={showToast} />
    </div>
);

export default Upgrade;

import type { NextPage } from "next";
import Header from "../components/Header";
import DowngradeWidget from "../components/widgets/DowngradeWidget";
import ToastType from "../types/toastType";

interface DowngradeProps {
    account: string;
    showToast: (type: ToastType) => {};
}

const Downgrade: NextPage<DowngradeProps> = ({ account, showToast }) => (
    <div>
        <Header account={account} />
        <DowngradeWidget showToast={showToast} />
    </div>
);

export default Downgrade;

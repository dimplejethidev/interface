import type { NextPage } from "next";
import Header from "../components/Header";
import DowngradeWidget from "../components/widgets/DowngradeWidget";
import ToastType from "../types/toastType";

interface DowngradeProps {
    showToast: (type: ToastType) => {};
}

const Downgrade: NextPage<DowngradeProps> = ({ showToast }) => (
    <div>
        <Header />
        <DowngradeWidget showToast={showToast} />
    </div>
);

export default Downgrade;

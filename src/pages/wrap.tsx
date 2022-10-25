import type { NextPage } from "next";
import UpgradeDowngradeWidget from "../components/widgets/UpgradeDowngradeWidget";
import ToastType from "../types/ToastType";

interface WrapProps {
    showToast: (type: ToastType) => {};
}

const Wrap: NextPage<WrapProps> = ({ showToast }) => {
    return (
        <UpgradeDowngradeWidget showToast={showToast} />
    );
}

export default Wrap;

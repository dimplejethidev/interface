import type { NextPage } from "next";
import Header from "../components/Header";

import DowngradeWidget from "../components/widgets/DowngradeWidget";
import UpgradeWidget from "../components/widgets/UpgradeWidget";
import ToastType from "../types/ToastType";

interface UpgradeProps {
    showToast: (type: ToastType) => {};
}

const Upgrade: NextPage<UpgradeProps> = ({ showToast }) => (
    <div>
        <Header />
        <main>
            <UpgradeWidget showToast={showToast} />
            <DowngradeWidget showToast={showToast} />
        </main>
    </div>
);

export default Upgrade;

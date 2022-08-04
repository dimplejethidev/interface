import type { NextPage } from "next";
import Header from "../components/Header";
import UpgradeWidget from "../components/widgets/UpgradeWidget";

interface UpgradeProps {
    account: string;
}
const Upgrade: NextPage<UpgradeProps> = ({ account }) => (
    <div>
        <Header account={account} />
        <UpgradeWidget />
    </div>
);

export default Upgrade;

import type { NextPage } from "next";
import Header from "../components/Header";
import DowngradeWidget from "../components/widgets/DowngradeWidget";

interface DowngradeProps {
    account: string;
}

const Downgrade: NextPage<DowngradeProps> = ({ account }) => (
    <div>
        <Header account={account} />

        <DowngradeWidget />
    </div>
);

export default Downgrade;

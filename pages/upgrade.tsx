import type { NextPage } from "next";
import Header from "../components/Header";
import UpgradeWidget from "../components/widgets/UpgradeWidget";

const Upgrade: NextPage = () => (
    <div>
        <Header />
        <UpgradeWidget />
    </div>
);

export default Upgrade;

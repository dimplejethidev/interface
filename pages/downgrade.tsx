import type { NextPage } from "next";
import Header from "../components/Header";
import DowngradeWidget from "../components/widgets/DowngradeWidget";

const Downgrade: NextPage = () => (
    <div>
        <Header />
        <DowngradeWidget />
    </div>
);

export default Downgrade;

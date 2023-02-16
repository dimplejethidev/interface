import type { NextPage } from "next";
import { useState } from "react";
import UpgradeDowngradeWidget from "../components/widgets/UpgradeDowngradeWidget";

const Wrap: NextPage = () => {
    // used to easily reset component state
    const [keyNum, setKeyNum] = useState(1);

    return (
        <UpgradeDowngradeWidget key={`wrap-${keyNum}`} setKeyNum={setKeyNum} />
    );
};

export default Wrap;

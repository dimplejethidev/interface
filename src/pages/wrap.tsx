import type { NextPage } from "next";
import { useState } from "react";
import UpgradeDowngradeWidget from "../components/widgets/UpgradeDowngradeWidget";
import ToastType from "../types/ToastType";

interface WrapProps {
    showToast: (type: ToastType) => {};
}

const Wrap: NextPage<WrapProps> = ({ showToast }) => {

    // used to easily reset component state
    const [keyNum, setKeyNum] = useState(1);

    return (
        <UpgradeDowngradeWidget showToast={showToast} key={'wrap-' + keyNum} setKeyNum={setKeyNum} />
    );
}

export default Wrap;

import type { NextPage } from "next";
import { useState } from "react";
import "tailwindcss/tailwind.css";

import CreateStreamWidget from "../components/widgets/CreateStreamWidget";
import ToastType from "../types/ToastType";

interface SwapProps {
    showToast: (type: ToastType) => {};
}

const Swap: NextPage<SwapProps> = ({ showToast }) => {
    // used to easily reset component state
    const [keyNum, setKeyNum] = useState(1);

    return (
        <CreateStreamWidget
            showToast={showToast}
            key={`swap-${keyNum}`}
            setKeyNum={setKeyNum}
        />
    );
};

export default Swap;

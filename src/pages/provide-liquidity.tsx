import type { NextPage } from "next";
import { useState } from "react";
import ProvideLiquidityWidget from "../components/widgets/ProvideLiquidityWidget";

const ProvideLiquidity: NextPage = () => {
    // used to easily reset component state
    const [keyNum, setKeyNum] = useState(1);

    return (
        <ProvideLiquidityWidget
            key={`provideliquidity-${keyNum}`}
            setKeyNum={setKeyNum}
        />
    );
};

export default ProvideLiquidity;

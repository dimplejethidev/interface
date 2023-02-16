import type { NextPage } from "next";
import { useState } from "react";

import CreateStreamWidget from "../components/widgets/CreateStreamWidget";

const Swap: NextPage = () => {
    // used to easily reset component state
    const [keyNum, setKeyNum] = useState(1);

    return <CreateStreamWidget key={`swap-${keyNum}`} setKeyNum={setKeyNum} />;
};

export default Swap;

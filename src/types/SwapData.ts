import { BigNumber } from "ethers";

interface SwapData {
    initialCumulative: BigNumber;
    realTimeCumulative: BigNumber;
    units: BigNumber;
}

export default SwapData;
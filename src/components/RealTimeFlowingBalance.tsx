import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { useAccount, useProvider } from "wagmi";

import AnimatedBalance from "./AnimatedBalance";
import { fDAIxp, fUSDCxp } from "../utils/constants";

const ANIMATION_MINIMUM_STEP_TIME = 100;
const REFRESH_STEP_TIME = 5000;
const REFRESH_INTERVAL = 300; // 300 * 100 = 30000 ms = 30 s

const RealTimeFlowingBalance = () => {
    const [currentBalance0, setCurrentBalance0] = useState<BigNumber>(
        ethers.BigNumber.from(0)
    );
    const [flowRate0, setFlowRate0] = useState<BigNumber>(
        ethers.BigNumber.from(0)
    );
    const [currentBalance1, setCurrentBalance1] = useState<BigNumber>(
        ethers.BigNumber.from(0)
    );
    const [flowRate1, setFlowRate1] = useState<BigNumber>(
        ethers.BigNumber.from(0)
    );
    const provider = useProvider();
    const { address } = useAccount();

    async function refresh() {
        // refresh vars
        const tokenABI = [
            "function realtimeBalanceOf(address account, uint256 timestamp) public view returns (int256 availableBalance, uint256 deposit, uint256 owedDeposit)",
        ];
        if (address) {
            const tokenContract0 = new ethers.Contract(
                fDAIxp,
                tokenABI,
                provider
            );
            const tokenContract1 = new ethers.Contract(
                fUSDCxp,
                tokenABI,
                provider
            );
            const currentTimestampBigNumber = ethers.BigNumber.from(
                new Date().valueOf() // Milliseconds elapsed since UTC epoch, disregards timezone.
            );

            // set token0 state
            const initialBalance0 = (
                await tokenContract0.realtimeBalanceOf(
                    address,
                    currentTimestampBigNumber.div(1000).toString()
                )
            ).availableBalance;
            const futureBalance0 = (
                await tokenContract0.realtimeBalanceOf(
                    address,
                    currentTimestampBigNumber
                        .div(1000)
                        .add(
                            (REFRESH_INTERVAL * ANIMATION_MINIMUM_STEP_TIME) /
                                1000
                        )
                        .toString()
                )
            ).availableBalance;
            setCurrentBalance0(initialBalance0);
            setFlowRate0(
                futureBalance0.sub(initialBalance0).div(REFRESH_INTERVAL)
            );

            // set token1 state
            const initialBalance1 = (
                await tokenContract1.realtimeBalanceOf(
                    address,
                    currentTimestampBigNumber.div(1000).toString()
                )
            ).availableBalance;
            const futureBalance1 = (
                await tokenContract1.realtimeBalanceOf(
                    address,
                    currentTimestampBigNumber
                        .div(1000)
                        .add(
                            (REFRESH_INTERVAL * ANIMATION_MINIMUM_STEP_TIME) /
                                1000
                        )
                        .toString()
                )
            ).availableBalance;
            setCurrentBalance1(initialBalance1);
            setFlowRate1(
                futureBalance1.sub(initialBalance1).div(REFRESH_INTERVAL)
            );
        }
    }

    // REFRESH(in milliseconds) = REFRESH_INTERVAL * ANIMATION_MINIMUM_STEP_TIME
    const [time, setTime] = useState(REFRESH_INTERVAL);
    useEffect(() => {
        const timer = setTimeout(() => {
            setTime(time + 1);
            if (time >= REFRESH_INTERVAL) {
                setTime(0);
                refresh();
            }

            // animate frame
            setCurrentBalance0((c) => c.add(flowRate0));
            setCurrentBalance1((c) => c.add(flowRate1));
        }, ANIMATION_MINIMUM_STEP_TIME);
        return () => {
            clearTimeout(timer);
        };
    }, [time]);

    useEffect(() => {
        refresh();
    }, [address]);

    return (
        <div className="flex items-center justify-center">
            <div className="flex flex-col p-8 rounded-3xl centered-shadow items-center justify-center">
                <div className="flex w-full pb-8 space-x-2">
                    <div className="flex font-semibold px-4 py-2 rounded-xl text-lg whitespace-nowrap text-aqueductBlue bg-aqueductBlue/10 w-min mr-2">
                        Pool:
                    </div>
                    <div className="flex items-center justify-center space-x-1 font-semibold px-6 py-2 rounded-xl text-lg whitespace-nowrap text-daiYellow bg-daiYellow/10 w-min">
                        <p>fDAIxp</p>
                        <img src="dai-logo.png" className="w-4 h-4" />
                    </div>
                    <div className="flex items-center justify-center space-x-1 font-semibold px-6 py-2 rounded-xl text-lg whitespace-nowrap text-usdcBlue bg-usdcBlue/10 w-min">
                        <p>fUSDCxp</p>
                        <img src="usdc-logo.png" className="w-4 h-4" />
                    </div>
                </div>
                <div className="flex items-center justify-center p-4 border-[1px] centered-shadow-sm rounded-2xl text-daiYellow">
                    <div className="flex items-center justify-center px-12 py-8 space-x-8 rounded-xl bg-daiYellow/10">
                        <AnimatedBalance
                            value={parseFloat(
                                ethers.utils.formatEther(currentBalance0)
                            ).toFixed(6)}
                            isIncreasing={flowRate0.gte(0)}
                        />
                        <img src="dai-logo.png" className="w-12 h-12" />
                    </div>
                </div>
                <div className="px-16 overflow-hidden">
                    <div
                        className={
                            "w-40 h-40 border-[1px] centered-shadow-sm px-4 " +
                            (flowRate1.gte(0) && "rotate-180")
                        }
                    >
                        <div className="w-full h-full overflow-hidden">
                            <div className="w-full h-40 bg-aqueductBlue/90" />
                            <div
                                className={
                                    "w-full h-80 bg-blue-400 animate-ping " +
                                    (flowRate0.eq(0) &&
                                        flowRate1.eq(0) &&
                                        "opacity-0")
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center p-4 border-[1px] centered-shadow-sm rounded-2xl text-usdcBlue">
                    <div className="flex items-center justify-center px-12 py-8 space-x-8 rounded-xl bg-usdcBlue/10">
                        <AnimatedBalance
                            value={parseFloat(
                                ethers.utils.formatEther(currentBalance1)
                            ).toFixed(6)}
                            isIncreasing={flowRate1.gte(0)}
                        />
                        <img src="usdc-logo.png" className="w-12 h-12" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RealTimeFlowingBalance;

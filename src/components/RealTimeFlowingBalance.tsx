import { ReactElement, useEffect, useState } from "react";
import { ethers } from "ethers";
import { useStore } from "../store";
import { useAccount, useProvider } from 'wagmi'

import AnimatedBalance from "./AnimatedBalance";
import tokens from "../utils/tokens";

const ANIMATION_MINIMUM_STEP_TIME = 100;
const REFRESH_STEP_TIME = 5000;
const REFRESH_INTERVAL = 300; // 300 * 100 = 30000 ms = 30 s

const RealTimeFlowingBalance = (): ReactElement => {
    const [currentBalance, setCurrentBalance] = useState<ethers.BigNumber>(ethers.BigNumber.from(0));
    const [flowRate, setFlowRate] = useState<ethers.BigNumber>(ethers.BigNumber.from(0));
    const store = useStore();
    const provider = useProvider();
    const { address } = useAccount();
    const [isIncreasing, setIsIncreasing] = useState(true);

    // REFRESH(in milliseconds) = REFRESH_INTERVAL * ANIMATION_MINIMUM_STEP_TIME
    const [time, setTime] = useState(REFRESH_INTERVAL);
    useEffect(() => {
        const timer = setTimeout(() => {
            setTime(time + 1);
            if (time >= REFRESH_INTERVAL) {
                setTime(0);

                async function refresh() {
                    // refresh vars
                    console.log('updating ...');
                    const tokenABI = [
                        "function realtimeBalanceOf(address account, uint256 timestamp) public view returns (int256 availableBalance, uint256 deposit, uint256 owedDeposit)",
                    ];
                    const tokenAddress = tokens.get(store.selectedToken)?.address;
                    if (tokenAddress && address) {
                        const tokenContract = new ethers.Contract(tokenAddress, tokenABI, provider);
                        const currentTimestampBigNumber = ethers.BigNumber.from(
                            new Date().valueOf() // Milliseconds elapsed since UTC epoch, disregards timezone.
                        );
                        const initialBalance = (await tokenContract.realtimeBalanceOf(address, currentTimestampBigNumber.div(1000).toString())).availableBalance;
                        const futureBalance = (await tokenContract.realtimeBalanceOf(address, currentTimestampBigNumber.div(1000).add(REFRESH_INTERVAL * ANIMATION_MINIMUM_STEP_TIME / 1000).toString())).availableBalance;
                        setIsIncreasing(futureBalance.sub(initialBalance).toNumber() > 0);
                        setCurrentBalance(initialBalance)
                        setFlowRate(futureBalance.sub(initialBalance).div(REFRESH_INTERVAL));
                    }
                }

                refresh();
            }

            // animate frame
            setCurrentBalance(c => c.add(flowRate));

        }, ANIMATION_MINIMUM_STEP_TIME);
        return () => {
            clearTimeout(timer);
        };
    }, [time]);

    useEffect(() => {
        setTime(REFRESH_INTERVAL);
    }, [store.selectedToken])

    return (
        <div className="flex w-full items-center justify-center">
            {
                <AnimatedBalance value={parseFloat(ethers.utils.formatEther(currentBalance)).toFixed(5)} isIncreasing={isIncreasing} />
            }
        </div>
    )
}

export default RealTimeFlowingBalance;

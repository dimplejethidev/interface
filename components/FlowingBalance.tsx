import { FC, ReactElement, useEffect, useMemo, useState } from "react";
import { BigNumberish, ethers } from "ethers";

const ANIMATION_MINIMUM_STEP_TIME = 100;

export interface FlowingBalanceProps {
    balance: string;
    balanceTimestamp: number;
    flowRate: string;
}

const FlowingBalance: FC<FlowingBalanceProps> = ({
    balance,
    balanceTimestamp,
    flowRate,
}): ReactElement => {
    const [weiValue, setWeiValue] = useState<BigNumberish>(balance);

    const balanceTimestampMs = useMemo(
        () => ethers.BigNumber.from(balanceTimestamp).mul(1000),
        [balanceTimestamp]
    );

    useEffect(() => {
        const flowRateBigNumber = ethers.BigNumber.from(flowRate);
        if (flowRateBigNumber.isZero()) {
            return; // do not show animation when flow rate is zero
        }

        const balanceBigNumber = ethers.BigNumber.from(balance);

        let stopAnimation = false;
        let lastAnimationTimestamp: DOMHighResTimeStamp = 0;

        const animationStep = (
            currentAnimationTimestamp: DOMHighResTimeStamp
        ) => {
            if (stopAnimation) {
                return;
            }

            if (
                currentAnimationTimestamp - lastAnimationTimestamp >
                ANIMATION_MINIMUM_STEP_TIME
            ) {
                const currentTimestampBigNumber = ethers.BigNumber.from(
                    new Date().valueOf() // Milliseconds elapsed since UTC epoch, disregards timezone.
                );

                // B = (t - t1) * r
                setWeiValue(
                    balanceBigNumber.add(
                        currentTimestampBigNumber
                            .sub(balanceTimestampMs)
                            .mul(flowRateBigNumber)
                            .div(1000)
                    )
                );

                lastAnimationTimestamp = currentAnimationTimestamp;
            }
            window.requestAnimationFrame(animationStep);
        };

        window.requestAnimationFrame(animationStep);

        return () => {
            stopAnimation = true;
        };
    }, [balance, balanceTimestamp, flowRate]);

    // Assumes the token has 18 decimals
    const formattedBalance = ethers.utils.formatEther(weiValue);

    return (
        <div>
            <p>DAI balance: {formattedBalance}</p>
        </div>
    );
};

export default FlowingBalance;

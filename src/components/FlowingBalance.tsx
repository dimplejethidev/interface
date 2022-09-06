import { FC, ReactElement, useEffect, useMemo, useState } from "react";
import { BigNumberish, ethers } from "ethers";
import { useStore } from "../store";

const ANIMATION_MINIMUM_STEP_TIME = 100;

export interface FlowingBalanceProps {
    balance: string;
    balanceTimestamp: number | undefined;
    flowRate: string;
}

const FlowingBalance: FC<FlowingBalanceProps> = ({
    balance,
    balanceTimestamp,
    flowRate,
}): ReactElement => {
    const [weiValue, setWeiValue] = useState<BigNumberish>(balance);
    const store = useStore();

    const balanceTimestampBigNumber = useMemo(
        () => ethers.BigNumber.from(balanceTimestamp),
        [balanceTimestamp]
    );

    useEffect(() => {
        const flowRateBigNumber = ethers.BigNumber.from(flowRate);
        if (flowRateBigNumber.isZero()) {
            return; // do not show animation when flow rate is zero
        }

        const balanceBigNumber = ethers.BigNumber.from(balance);
        console.log(balanceBigNumber)

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
                            .sub(balanceTimestampBigNumber)
                            .mul(flowRateBigNumber)
                            .div(1)
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
    const formattedBalance = ethers.utils.formatEther(weiValue).substring(0, 8);

    return (
        <div className="flex justify-center items-center h-14 w-full font-bold">
            <p className="font-bold text-7xl monospace-font text-gray-600 tracking-widest">
                {formattedBalance}{" "}
                <span className="font-light text-xl text-blue-500 tracking-normal">{store.selectedToken}</span>
            </p>
        </div>
    );
};

export default FlowingBalance;

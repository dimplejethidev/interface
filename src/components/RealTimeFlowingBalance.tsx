import { FC, ReactElement, useEffect, useMemo, useState, useRef } from "react";
import { BigNumberish, ethers } from "ethers";
import { useStore } from "../store";
import { useAccount } from 'wagmi'

import { useSpring, animated } from 'react-spring';
import AnimatedBalance from "./AnimatedBalance";

const ANIMATION_MINIMUM_STEP_TIME = 100;
const REFRESH_STEP_TIME = 5000;
const REFRESH_INTERVAL = 50;

function useInterval(callback: any, delay: any) {
    const savedCallback: any = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

const RealTimeFlowingBalance2 = (): ReactElement => {
    const { address } = useAccount();
    //const [weiValue, setWeiValue] = useState<BigNumberish>(balance);
    //const [initialBalance, setInitialBalance] = useState<ethers.BigNumber>(ethers.BigNumber.from(0));
    const tempIncreaseRate = ethers.BigNumber.from(1000000000000000);
    //const [futureBalance, setFutureBalance] = useState<ethers.BigNumber>(tempIncreaseRate);
    const [currentBalance, setCurrentBalance] = useState<ethers.BigNumber>(tempIncreaseRate);
    const [lastBalance, setLastBalance] = useState<ethers.BigNumber>(ethers.BigNumber.from(0));
    const [currentFlowRate, setCurrentFlowRate] = useState<ethers.BigNumber>(ethers.BigNumber.from(0));
    const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState<ethers.BigNumber>(ethers.BigNumber.from(0));
    const store = useStore();

    useEffect(() => {

        // set interval to refresh flow data every 30 seconds
        /*
        const interval = setInterval(() => {
            //useInterval(() => {
            console.log('updating ...');

            // get current and future balances
            const initialBalance: ethers.BigNumber = currentBalance;
            const futureBalance: ethers.BigNumber = initialBalance.mul(2);

            // compute state vars
            //setCurrentBalance(initialBalance);
            /*
            setLastBalance(
                initialBalance
            );
            *
            setCurrentFlowRate(
                futureBalance.sub(initialBalance).div(REFRESH_STEP_TIME / ANIMATION_MINIMUM_STEP_TIME)
            );
            /*
            console.log(futureBalance.toString());
            console.log(initialBalance.toString());
            console.log(newFlowRate.toString());
            console.log(currentFlowRate.toString())
            setLastUpdateTimestamp(
                ethers.BigNumber.from(
                    new Date().valueOf()
                )
            )
            *
        }, REFRESH_STEP_TIME);*/

        let stopAnimation = false;
        let lastAnimationTimestamp: DOMHighResTimeStamp = 0;
        let lastRefreshTimestamp: DOMHighResTimeStamp = 0;

        const animationStep = (
            currentAnimationTimestamp: DOMHighResTimeStamp
        ) => {
            if (stopAnimation) {
                return;
            }

            if (
                currentAnimationTimestamp - lastRefreshTimestamp >
                REFRESH_STEP_TIME
            ) {
                console.log('updating ...');

                // get current and future balances
                const initialBalance: ethers.BigNumber = currentBalance;
                const futureBalance: ethers.BigNumber = initialBalance.mul(2);

                // compute state vars
                //setCurrentBalance(initialBalance);
                /*
                setLastBalance(
                    initialBalance
                );
                */
                setCurrentFlowRate(
                    futureBalance.sub(initialBalance).div(REFRESH_STEP_TIME / ANIMATION_MINIMUM_STEP_TIME)
                );
                console.log(futureBalance.toString());
                console.log(initialBalance.toString());
                console.log(futureBalance.sub(initialBalance).div(REFRESH_STEP_TIME / ANIMATION_MINIMUM_STEP_TIME).toString());
                console.log(currentFlowRate.toString())

                lastRefreshTimestamp = currentAnimationTimestamp;
            }

            if (
                currentAnimationTimestamp - lastAnimationTimestamp >
                ANIMATION_MINIMUM_STEP_TIME
            ) {
                const currentTimestamp = ethers.BigNumber.from(
                    new Date().valueOf() // Milliseconds elapsed since UTC epoch, disregards timezone.
                );

                /*
                setCurrentBalance(
                    lastBalance
                        .add(
                            currentTimestamp
                                .sub(lastUpdateTimestamp)
                                .mul(currentFlowRate)
                        )
                );
                */
                //console.log(currentFlowRate.toString())



                //const newBalance = currentBalance.add(currentFlowRate);
                setCurrentBalance(c => c.add(currentFlowRate));

                //console.log(currentFlowRate.toString())
                //console.log(currentBalance.add(currentFlowRate).toString())
                //console.log(currentBalance.toString())

                lastAnimationTimestamp = currentAnimationTimestamp;
            }
            window.requestAnimationFrame(animationStep);
        };

        window.requestAnimationFrame(animationStep);

        return () => {
            stopAnimation = true;
            //clearInterval(interval);
        };
    }, [address]);

    // Assumes the token has 18 decimals
    //onst formattedBalance = ethers.utils.formatEther(weiValue).substring(0, 8);

    return (
        <div className="flex justify-center items-center h-14 w-full font-bold">
            <p className="font-bold text-7xl monospace-font text-gray-700 tracking-widest">
                {ethers.utils.formatEther(currentBalance)}{" "}
                <span className="font-light text-xl text-blue-500 tracking-normal">{store.selectedToken}</span>
            </p>
        </div>
    );
};

const RealTimeFlowingBalance3 = (): ReactElement => {
    const { address } = useAccount();
    //const [weiValue, setWeiValue] = useState<BigNumberish>(balance);
    const [initialBalance, setInitialBalance] = useState<ethers.BigNumber>(ethers.BigNumber.from(0));
    const tempIncreaseRate = ethers.BigNumber.from(1000000000000000);
    const [futureBalance, setFutureBalance] = useState<ethers.BigNumber>(tempIncreaseRate);
    //const [currentBalance, setCurrentBalance] = useState<ethers.BigNumber>(tempIncreaseRate);
    //const [lastBalance, setLastBalance] = useState<ethers.BigNumber>(ethers.BigNumber.from(0));
    //const [currentFlowRate, setCurrentFlowRate] = useState<ethers.BigNumber>(ethers.BigNumber.from(0));
    //const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState<ethers.BigNumber>(ethers.BigNumber.from(0));
    const store = useStore();

    //const [num, setNum] = useState(1000000);
    //const props = useSpring({ val: num, from: { val: 0 } });
    //const props = useSpring({ val: futureBalance.toNumber(), from: { val: 0 } });

    const randomNum = Math.floor(Math.random() * 1000000);

    /*
    useEffect(() => {
        const interval = setInterval(() => {
            //useInterval(() => {
            console.log('updating ...');

            setInitialBalance(futureBalance);
            setFutureBalance(initialBalance.mul(2));
            // get current and future balances
            //const initialBalance: ethers.BigNumber = initialBalance;
            //const futureBalance: ethers.BigNumber = initialBalance.mul(2);

            // compute state vars
            //setCurrentBalance(initialBalance);
            /*
            setLastBalance(
                initialBalance
            );
            *
            //setCurrentFlowRate(
            //    futureBalance.sub(initialBalance).div(REFRESH_STEP_TIME / ANIMATION_MINIMUM_STEP_TIME)
            //);
        }, REFRESH_STEP_TIME);

        return () => {
            clearInterval(interval);
        };
    }, [address]);*/


    /*
    const [time, setTime] = useState(0);
    useEffect(() => {
        const timer = setTimeout(() => {
            setTime(time + 1);

            console.log('updating ...');
            //setFutureBalance(b => b.mul(2));

        }, 10000);
        return () => {
            clearTimeout(timer);
        };
    }, [time]);
    */

    const [time, setTime] = useState(0);
    useEffect(() => {
        const timer = setTimeout(() => {
            setTime(time + 1);

            console.log('updating ...');

            //setInitialBalance(futureBalance);
            //setFutureBalance(initialBalance.mul(2));

            //setFutureBalance(b => b.mul(2));

        }, ANIMATION_MINIMUM_STEP_TIME);
        return () => {
            clearTimeout(timer);
        };
    }, [time]);

    return (
        <div className="flex w-full items-center justify-center">
            <AnimatedBalance value={ethers.utils.formatEther(futureBalance).toString()} />
        </div>
    )

    /*return (
        <div className="App">
            <div className="card">
                <animated.div className="number">
                    {props.val.to(val => Math.floor(val))}
                </animated.div>
                <button onClick={() => setNum(randomNum)}>Random Number</button>
            </div>
        </div>
    );*/

    /*
    return (
        <div className="flex justify-center items-center h-14 w-full font-bold">
            <animated.div className="font-bold text-7xl monospace-font text-gray-700 tracking-widest">
                {ethers.utils.formatEther(currentBalance)}{" "}
                <span className="font-light text-xl text-blue-500 tracking-normal">{store.selectedToken}</span>
            </animated.div>
        </div>
    );
    */
}

const RealTimeFlowingBalance = (): ReactElement => {
    //const { address } = useAccount();
    const [initialBalance, setInitialBalance] = useState<ethers.BigNumber>(ethers.BigNumber.from(500000000000000));
    const [currentBalance, setCurrentBalance] = useState<ethers.BigNumber>(ethers.BigNumber.from(0));
    const [futureBalance, setFutureBalance] = useState<ethers.BigNumber>(ethers.BigNumber.from(1000000000000000));
    const [flowRate, setFlowRate] = useState<ethers.BigNumber>(ethers.BigNumber.from(10000000000000));

    // REFRESH(in milliseconds) = REFRESH_INTERVAL * ANIMATION_MINIMUM_STEP_TIME
    const [time, setTime] = useState(0);
    useEffect(() => {
        const timer = setTimeout(() => {
            setTime(time + 1);
            if (time >= REFRESH_INTERVAL) {
                setTime(0);

                // refresh vars
                console.log('updating ...');
                setInitialBalance(b => b.mul(2));
                setFutureBalance(b => b.mul(2));
                setFlowRate(futureBalance.sub(initialBalance).div(REFRESH_INTERVAL))
                //setFlowRate(f => f.mul(2));
            }

            // animate frame
            setCurrentBalance(c => c.add(flowRate));

        }, ANIMATION_MINIMUM_STEP_TIME);
        return () => {
            clearTimeout(timer);
        };
    }, [time]);

/*
    useEffect(() => {
        let stopAnimation = false;
        let lastAnimationTimestamp: DOMHighResTimeStamp = 0;
        let lastRefreshTimestamp: DOMHighResTimeStamp = 0;

        const animationStep = (
            currentAnimationTimestamp: DOMHighResTimeStamp
        ) => {
            if (stopAnimation) {
                return;
            }

            if (
                currentAnimationTimestamp - lastRefreshTimestamp >
                REFRESH_STEP_TIME
            ) {
                console.log('updating ...');
                setInitialBalance(b => b.mul(2));
                setFutureBalance(b => b.mul(2));
                //setFlowRate(futureBalance.sub(initialBalance).div(REFRESH_STEP_TIME / ANIMATION_MINIMUM_STEP_TIME))
                setFlowRate(f => f.mul(2));
                lastRefreshTimestamp = currentAnimationTimestamp;
            }

            if (
                currentAnimationTimestamp - lastAnimationTimestamp >
                ANIMATION_MINIMUM_STEP_TIME
            ) {

                setCurrentBalance(c => c.add(flowRate));
                console.log(flowRate)

                lastAnimationTimestamp = currentAnimationTimestamp;
            }
            window.requestAnimationFrame(animationStep);
        };

        window.requestAnimationFrame(animationStep);

        return () => {
            stopAnimation = true;
        };
    }, [time]);*/

    return (
        <div className="flex w-full items-center justify-center">
            {  
                /*<div className="flex space-x-2 text-6xl h-16 overflow-hidden monospace-font text-gray-700 font-bold  tracking-widest">
                    {parseFloat(ethers.utils.formatEther(currentBalance)).toFixed(5)}
                </div>*/
            }
            {
                <AnimatedBalance value={parseFloat(ethers.utils.formatEther(currentBalance)).toFixed(5)} />
            }
        </div>
    )
}

export default RealTimeFlowingBalance;

import { useEffect, useRef, useState } from "react";

const increasingNumbers = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4,
    5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4,
    5, 6, 7, 8, 9,
];
const decreasingNumbers = increasingNumbers.slice().reverse();

function AnimatedDigit({
    digit,
    isIncreasing,
}: {
    digit: number;
    isIncreasing: boolean;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [offset, setOffset] = useState(0);
    const [previousDigit, setPreviousDigit] = useState(digit);
    const [pauseAnimation, setPauseAnimation] = useState(false);
    const [currentTimeout, setCurrentTimeout] = useState<NodeJS.Timeout>();
    const tapeLength = 6; // 8 units (count from 0)
    const [tapePosition, setTapePosition] = useState(0);

    useEffect(() => {
        if (ref.current) {
            // update tape position
            var updatedTapePosition = tapePosition;
            if (
                (isIncreasing && previousDigit > digit) ||
                (!isIncreasing && previousDigit < digit)
            ) {
                setTapePosition((t) => t + 1);
                updatedTapePosition += 1;
            }

            // animate to new digit
            setPauseAnimation(false);
            const wrapperPos = ref.current.getBoundingClientRect().y;
            const digitPos = ref.current.children
                .item(
                    updatedTapePosition * 10 +
                        (isIncreasing ? digit : 9 - digit)
                )
                ?.getBoundingClientRect().y;
            if (digitPos) {
                setOffset(wrapperPos - digitPos);
            }
            setPreviousDigit(digit);
            const wrapperPos2 = ref.current.getBoundingClientRect().y;
            const digitPos2 = ref.current.children
                .item(0)
                ?.getBoundingClientRect().y;

            if (currentTimeout) {
                //clearTimeout(currentTimeout);
            }
            if (updatedTapePosition > tapeLength) {
                setCurrentTimeout(
                    setTimeout(() => {
                        console.log("UPDATING");
                        setPauseAnimation(true);
                        setTapePosition(0);
                        setOffset(0);
                    }, 200)
                );
            }
        }
    }, [digit]);

    return (
        <div
            ref={ref}
            style={{
                willChange: "transform",
                transform: `translate3d(0, ${offset}px, 0)`,
            }}
            className={
                !pauseAnimation ? "transition-all ease-in-out duration-300" : ""
            }
        >
            {(isIncreasing ? increasingNumbers : decreasingNumbers).map((d) => {
                return <div>{d}</div>;
            })}
        </div>
    );
}

interface AnimatedBalanceProps {
    value: string;
    isIncreasing: boolean;
}

const AnimatedBalance = ({ value, isIncreasing }: AnimatedBalanceProps) => {
    return (
        <div className="flex space-x-2 text-6xl h-16 overflow-hidden monospace-font text-gray-7000 font-bold">
            {value.split("").map((digit) => {
                if (digit == ".") {
                    return <p>{digit}</p>;
                } else {
                    return (
                        <AnimatedDigit
                            digit={parseInt(digit)}
                            isIncreasing={isIncreasing}
                        />
                    );
                }
            })}
        </div>
    );
};

export default AnimatedBalance;

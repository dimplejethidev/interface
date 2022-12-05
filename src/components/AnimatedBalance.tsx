import { useEffect, useRef, useState } from "react";

const increasingNumbers = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4,
    5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4,
    5, 6, 7, 8, 9,
];
const decreasingNumbers = increasingNumbers.slice().reverse();

const AnimatedDigit = ({
    digit,
    isIncreasing,
}: {
    digit: number;
    isIncreasing: boolean;
}) => {
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
            let updatedTapePosition = tapePosition;
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
            // TODO: can these two variables be deleted?
            // const wrapperPos2 = ref.current.getBoundingClientRect().y;
            // const digitPos2 = ref.current.children
            //     .item(0)
            //     ?.getBoundingClientRect().y;

            if (currentTimeout) {
                // TODO: is this important?
                // clearTimeout(currentTimeout);
            }
            if (updatedTapePosition > tapeLength) {
                setCurrentTimeout(
                    setTimeout(() => {
                        setPauseAnimation(true);
                        setTapePosition(0);
                        setOffset(0);
                    }, 200)
                );
            }
        }
        // TODO: Assess missing dependency array values
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            {(isIncreasing ? increasingNumbers : decreasingNumbers).map((d) => (
                <div key={d}>{d}</div>
            ))}
        </div>
    );
};

interface AnimatedBalanceProps {
    value: string;
    isIncreasing: boolean;
}

const AnimatedBalance = ({ value, isIncreasing }: AnimatedBalanceProps) => (
    <div className="flex space-x-2 text-4xl h-10 lg:text-5xl lg:h-12 xl:text-6xl xl:h-16 overflow-hidden monospace-font text-gray-7000 font-bold">
        {value.split("").map((digit) => {
            if (digit === ".") {
                return <p>{digit}</p>;
            }
            return (
                <AnimatedDigit
                    // eslint-disable-next-line radix
                    digit={parseInt(digit)}
                    isIncreasing={isIncreasing}
                />
            );
        })}
    </div>
);

export default AnimatedBalance;

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
    }, [digit, currentTimeout, tapePosition, isIncreasing, previousDigit]);

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

export default AnimatedDigit;

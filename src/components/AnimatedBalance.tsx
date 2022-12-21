import AnimatedDigit from "./AnimatedDigit";

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

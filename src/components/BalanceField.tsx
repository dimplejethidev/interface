import { BigNumber, ethers } from "ethers";
import { TokenOption } from "../types/TokenOption";

interface BalanceFieldProps {
    currentBalance: BigNumber;
    isTwap: boolean;
    token: TokenOption;
    numDecimals: number;
    isLoading: boolean;
}

const BalanceField = ({
    currentBalance,
    isTwap,
    token,
    numDecimals,
    isLoading,
}: BalanceFieldProps) => {
    if (isLoading) {
        return (
            <div className="bg-gray-200 dark:bg-gray-800 h-10 rounded-2xl animate-pulse" />
        );
    }

    return (
        <div
            className={`flex space-x-4 items-end rounded-2xl tracking-wider monospace-font font-bold ${
                // + (isTwap ? ('bg-[' + token.colorHex + '30] text-[' + token.colorHex + ']') : 'text-gray-300 text-5xl')
                isTwap
                    ? "text-gray-800 dark:text-white/90 text-3xl md:text-4xl lg:text-5xl xl:text-7xl"
                    : "text-gray-300 dark:text-slate-500/80 text-xl md:text-2xl lg:text-3xl xl:text-5xl font-semibold"
            }`}
        >
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <img
                src={token.logo}
                className={isTwap ? "h-12 mb-3 hidden" : "h-12 hidden"}
            />
            <p>
                {(isTwap ? "+" : "-") +
                    parseFloat(
                        ethers.utils.formatEther(currentBalance)
                    ).toLocaleString(undefined, {
                        minimumFractionDigits: numDecimals,
                    })}
            </p>
            <div className="flex space-x-1 md:space-x-2">
                {/* TODO: translate responsive width to be used with Image */}
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <img src={token.logo} className="h-4 md:h-6 xl:h-7 xl:mb-2" />
                <p
                    className="text-sm md:text-lg xl:text-2xl poppins-font font-bold tracking-normal"
                    style={{ color: token.colorHex }}
                >
                    {token.label}
                </p>
            </div>
        </div>
    );
};

export default BalanceField;

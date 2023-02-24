import { AiOutlineInfoCircle } from "react-icons/ai";
import { useStore } from "../store";
import LoadingSpinner from "./LoadingSpinner";

const maxDecimals = 10;
const minValue = 10 ** (-1 * maxDecimals);

interface PricingFieldProps {
    refreshingPrice: boolean;
    token0Price: number;
    poolExists: boolean;
}

const PricingField = ({
    refreshingPrice,
    token0Price,
    poolExists,
}: PricingFieldProps) => {
    const store = useStore();

    return (
        <div className="flex space-x-4 py-2 text-sm text-gray-400 items-center justify-center -translate-x-4">
            <div>
                <div
                    className={`text-aqueductBlue transition-all duration-500 absolute ${
                        refreshingPrice ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <LoadingSpinner size={20} />
                </div>
                <AiOutlineInfoCircle
                    size={20}
                    className={`transition-all duration-500 ${
                        refreshingPrice ? "opacity-0" : "opacity-100"
                    }`}
                />
            </div>
            {poolExists ? (
                <div className="flex space-x-1 items-center">
                    <p>1 {store.inboundToken.label} = </p>
                    {refreshingPrice ? (
                        <div className="bg-gray-200 dark:bg-gray-800 w-24 h-4 rounded-full animate-pulse" />
                    ) : (
                        <p>
                            {token0Price >= minValue
                                ? token0Price.toFixed(maxDecimals)
                                : `<${minValue.toFixed(maxDecimals)}`}
                        </p>
                    )}
                    <p> {store.outboundToken.label}</p>
                </div>
            ) : (
                <div>A pool does not exist for these tokens</div>
            )}
        </div>
    );
};

export default PricingField;

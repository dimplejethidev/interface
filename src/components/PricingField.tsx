import { BigNumber, ethers } from "ethers";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useStore } from "../store";
import LoadingSpinner from "./LoadingSpinner";
let maxDecimals = 10;
let minValue = Math.pow(10, -10);

interface PricingFieldProps {
    refreshingPrice: boolean;
    token0Price: number;
    priceMultiple?: BigNumber;
    swapFlowRate?: string;
    poolExists: boolean;
}

const PricingField = ({
    refreshingPrice,
    token0Price,
    priceMultiple,
    swapFlowRate,
    poolExists,
}: PricingFieldProps) => {
    const store = useStore();

    return (
        <div className="flex space-x-4 py-2 text-sm text-gray-400 items-center justify-center -translate-x-4">
            <div>
                <div
                    className={
                        "text-aqueductBlue transition-all duration-500 absolute " +
                        (refreshingPrice ? "opacity-100" : "opacity-0")
                    }
                >
                    <LoadingSpinner size={20} />
                </div>
                <AiOutlineInfoCircle
                    size={20}
                    className={
                        "transition-all duration-500 " +
                        (refreshingPrice ? "opacity-0" : "opacity-100")
                    }
                />
            </div>
            {poolExists ? (
                <div className="space-y-1">
                    <p>
                        1 {store.inboundToken.label} ={" "}
                        {token0Price >= minValue ? token0Price.toFixed(10) : ('<'+minValue.toFixed(10))}{" "}
                        {store.outboundToken.label}
                    </p>
                </div>
            ) : (
                <div>A pool does not exist for these tokens</div>
            )}
        </div>
    );
};

export default PricingField;

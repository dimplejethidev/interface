import { TokenOption } from "../../types/TokenOption";
import WidgetContainer from "./WidgetContainer";

interface PriceWidgetProps {
    isLoading: boolean;
    title: string;
    token0: TokenOption;
    token1: TokenOption;
    price: number;
}

const PriceWidget = ({
    isLoading,
    title,
    token0,
    token1,
    price,
}: PriceWidgetProps) => (
    <WidgetContainer smallTitle={title} isUnbounded>
        {isLoading ? (
            <div className="space-y-2">
                <div className="bg-gray-200 dark:bg-gray-800 h-10 w-1/2 rounded-2xl animate-pulse" />
                <div className="bg-gray-200 dark:bg-gray-800 h-10 w-4/5 rounded-2xl animate-pulse" />
            </div>
        ) : (
            <div className="px-4 space-y-2">
                <div className="flex items-end space-x-2">
                    <p className="text-2xl md:text-3xl lg:text-4xl font-bold monospace-font text-gray-800 dark:text-white">
                        1
                    </p>
                    <p className="text-xl md:text-2xl font-bold">
                        {token0.label}
                    </p>
                </div>
                <div className="flex items-end space-x-2">
                    <p className="text-2xl md:text-3xl lg:text-4xl font-bold monospace-font text-gray-800 dark:text-white">
                        {`= ${price}`}
                    </p>
                    <p className="text-xl md:text-2xl font-bold">
                        {token1.label}
                    </p>
                </div>
            </div>
        )}
    </WidgetContainer>
);

export default PriceWidget;

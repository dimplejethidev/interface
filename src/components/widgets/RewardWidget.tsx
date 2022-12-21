import { BigNumber } from "ethers";
import { TokenOption } from "../../types/TokenOption";
import BalanceField from "../BalanceField";
import WidgetContainer from "./WidgetContainer";

interface RewardWidgetProps {
    isLoading: boolean;
    // eslint-disable-next-line react/require-default-props
    title?: string;
    token0: TokenOption;
    token1: TokenOption;
    reward0: BigNumber;
    reward1: BigNumber;
    numDecimals0: number;
    numDecimals1: number;
}

const RewardWidget = ({
    isLoading,
    title,
    token0,
    token1,
    reward0,
    reward1,
    numDecimals0,
    numDecimals1,
}: RewardWidgetProps) => (
    <WidgetContainer smallTitle={title} isUnbounded>
        {isLoading ? (
            <div className="space-y-2">
                <div className="bg-gray-200 dark:bg-gray-800 h-10 w-1/2 rounded-2xl animate-pulse" />
                <div className="bg-gray-200 dark:bg-gray-800 h-10 w-4/5 rounded-2xl animate-pulse" />
            </div>
        ) : (
            <div className="space-y-2">
                {reward0.gt(0) && (
                    <BalanceField
                        currentBalance={reward0}
                        isTwap
                        token={token0}
                        numDecimals={numDecimals0}
                        isLoading={isLoading}
                    />
                )}
                {reward1.gt(0) && (
                    <BalanceField
                        currentBalance={reward1}
                        isTwap
                        token={token1}
                        numDecimals={numDecimals1}
                        isLoading={isLoading}
                    />
                )}
            </div>
        )}
    </WidgetContainer>
);

export default RewardWidget;

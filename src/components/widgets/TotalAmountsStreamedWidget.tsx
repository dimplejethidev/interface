/* eslint-disable radix */
import { BigNumber } from "ethers";
import { TokenOption } from "../../types/TokenOption";
import BalanceField from "../BalanceField";

interface TotalAmountsStreamedWidgetProps {
    flowRate0: BigNumber;
    flowRate1: BigNumber;
    twapFlowRate0: BigNumber;
    twapFlowRate1: BigNumber;
    currentBalance0: BigNumber;
    currentBalance1: BigNumber;
    token0: TokenOption;
    token1: TokenOption;
    currentTwapBalance0: BigNumber;
    currentTwapBalance1: BigNumber;
    isLoading: boolean;
}

const TotalAmountsStreamedWidget = ({
    flowRate0,
    flowRate1,
    twapFlowRate0,
    twapFlowRate1,
    currentBalance0,
    currentBalance1,
    token0,
    token1,
    currentTwapBalance0,
    currentTwapBalance1,
    isLoading,
}: TotalAmountsStreamedWidgetProps) => {
    const getNumerOfDecimals = (flowRate: BigNumber) => {
        const flowRateDigitCount = flowRate.toString().length;
        const firstDigit = parseInt(flowRate.toString()[0]);
        const oneOrZero = firstDigit > 5 ? 1 : 0;

        return 19 - flowRateDigitCount - oneOrZero;
    };

    return (
        <div className="md:space-y-3 lg:space-y-6 pb-2">
            <div className="space-y-4">
                {flowRate0.gt(0) && (
                    <BalanceField
                        currentBalance={currentBalance0}
                        isTwap={false}
                        token={token0}
                        numDecimals={getNumerOfDecimals(flowRate0)}
                        isLoading={isLoading}
                    />
                )}
                {flowRate1.gt(0) && (
                    <BalanceField
                        currentBalance={currentBalance1}
                        isTwap={false}
                        token={token1}
                        numDecimals={getNumerOfDecimals(flowRate1)}
                        isLoading={isLoading}
                    />
                )}
                {twapFlowRate0.gt(0) && (
                    <BalanceField
                        currentBalance={currentTwapBalance0}
                        isTwap
                        token={token0}
                        numDecimals={getNumerOfDecimals(twapFlowRate0)}
                        isLoading={isLoading}
                    />
                )}
                {twapFlowRate1.gt(0) && (
                    <BalanceField
                        currentBalance={currentTwapBalance1}
                        isTwap
                        token={token1}
                        numDecimals={
                            19 -
                            twapFlowRate1.add(1000).toString().length -
                            (parseInt(twapFlowRate1.toString()[0]) > 5 ? 1 : 0)
                        }
                        isLoading={isLoading}
                    />
                )}
            </div>
        </div>
    );
};

export default TotalAmountsStreamedWidget;

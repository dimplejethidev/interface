import { BigNumber } from "ethers";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useStore } from "../store";
import LoadingSpinner from "./LoadingSpinner";

interface PricingFieldProps {
    refreshingPrice: boolean;
    token1Price: number;
    priceMultiple: BigNumber;
    swapFlowRate: string;
    poolExists: boolean;
}

const PricingField = ({ refreshingPrice, token1Price, priceMultiple, swapFlowRate, poolExists }: PricingFieldProps) => {
    const store = useStore();

    return (
        <div className="flex space-x-4 py-2 text-sm text-gray-400 items-center justify-center -translate-x-4">
            <div>
                <div className={'text-aqueductBlue transition-all duration-500 absolute ' + (refreshingPrice ? 'opacity-100' : 'opacity-0')}>
                    <LoadingSpinner size={20} />
                </div>
                <AiOutlineInfoCircle size={20} className={'transition-all duration-500 ' + (refreshingPrice ? 'opacity-0' : 'opacity-100')} />
            </div>
            {
                poolExists
                    ?
                    <div className="space-y-1">
                        <p>
                            1 {store.outboundToken.label} = {token1Price != 0 ? token1Price : '<0.00001'} {store.inboundToken.label}
                        </p>
                        <p>
                            initial outgoing flowrate: {swapFlowRate != '' ? BigNumber.from(swapFlowRate).mul(priceMultiple).div(BigNumber.from(2).pow(128)).toString() : '_'} {store.inboundToken.label} / s
                        </p>
                    </div>
                    :
                    <div>
                        A pool does not exist for these tokens
                    </div>
            }
        </div>
    )
}
//priceMultiple.div(BigNumber.from(2).pow(112)).toNumber() / 2**16
//swapFlowRate != '' ? BigNumber.from(swapFlowRate).mul(priceMultiple).div(BigNumber.from(2).pow(128)).toString() : '_'
//swapFlowRate != '' ? BigNumber.from(swapFlowRate).mul(BigNumber.from(priceMultiple * 1000)).div(1000).toString() : '_'

export default PricingField;
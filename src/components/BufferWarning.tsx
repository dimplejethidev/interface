import { BigNumber, ethers } from "ethers";
import { Dispatch, SetStateAction } from "react";
import { BsCheckLg } from "react-icons/bs";
import { useStore } from "../store";
import { TokenOption } from "../types/TokenOption";

interface BufferWarningProps {
    minBalance: BigNumber;
    outboundTokenBalance: BigNumber;
    outboundToken: TokenOption;
    buffer: BigNumber;
    acceptedBuffer: boolean;
    setAcceptedBuffer?: Dispatch<SetStateAction<boolean>>;
    shouldShowAcceptButton?: boolean;
}

const BufferWarning = ({ minBalance, outboundTokenBalance, outboundToken, buffer, acceptedBuffer, setAcceptedBuffer, shouldShowAcceptButton }: BufferWarningProps) => {
    const store = useStore();

    return (
        <div>
            {
                minBalance.lt(outboundTokenBalance)
                    ?
                    <div
                        className={
                            "text-xs px-6 py-4 rounded-2xl space-y-4 transition-all duration-500 "
                            + (acceptedBuffer ? 'bg-gray-100 text-gray-900/90' : 'bg-red-100 text-red-900/90')
                        }
                    >
                        <p>
                            {'If you do not cancel the ' + outboundToken.label + ' stream before your balance reaches zero, you will lose your ' + ethers.utils.formatEther(buffer) + ' ' + outboundToken.label + ' buffer.'}
                        </p>
                        {
                            setAcceptedBuffer && shouldShowAcceptButton &&
                            <div className="flex space-x-2 pb-1 items-center">
                                <button
                                    className={
                                        "flex items-center justify-center text-white border-[2px] rounded-md w-5 h-5 "
                                        + (acceptedBuffer ? 'border-aqueductBlue bg-aqueductBlue' : 'border-red-900/90')
                                    }
                                    onClick={() => { setAcceptedBuffer(!acceptedBuffer); }}
                                >
                                    {acceptedBuffer && <BsCheckLg size={8} />}
                                </button>
                                <p className="text-xs">
                                    Yes, I understand the risk
                                </p>
                            </div>
                        }
                    </div>
                    :
                    <div
                        className={
                            "text-xs px-6 py-4 rounded-2xl space-y-4 transition-all duration-500 bg-red-100 text-red-900/90 "
                        }
                    >
                        {
                            buffer.gt(outboundTokenBalance)
                                ?
                                <p>
                                    {'You do not have enough balance to cover the ' + ethers.utils.formatEther(buffer) + ' ' + outboundToken.label + ' buffer.'}
                                </p>
                                :
                                <p>
                                    {'You need to leave enough balance to stream for 2 hours.'}
                                </p>
                        }
                    </div>
            }
        </div>
    );
}

export default BufferWarning;
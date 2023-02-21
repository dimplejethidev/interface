/* eslint-disable react/require-default-props */
import { BigNumber, ethers } from "ethers";
import { Dispatch, SetStateAction } from "react";
import { BsCheckLg } from "react-icons/bs";
import { TokenOption } from "../types/TokenOption";

interface BufferWarningProps {
    minBalance: BigNumber;
    outboundTokenBalance: BigNumber;
    outboundToken: TokenOption;
    buffer: BigNumber;
    acceptedBuffer: boolean;
    setAcceptedBuffer?: Dispatch<SetStateAction<boolean>>;
    shouldHideAcceptButton?: boolean;
}

const BufferWarning = ({
    minBalance,
    outboundTokenBalance,
    outboundToken,
    buffer,
    acceptedBuffer,
    setAcceptedBuffer,
    shouldHideAcceptButton,
}: BufferWarningProps) => (
    <div>
        <div
            className={`text-xs px-6 py-4 rounded-2xl transition-color duration-500 
                ${
                    acceptedBuffer
                        ? " bg-gray-100 dark:bg-gray-700/60 text-gray-900/90 dark:text-gray-400 "
                        : " bg-red-100 dark:bg-red-500/20 text-red-900/90 dark:text-red-400/90 "
                }
            `}
        >
            <div
                className={`transition-[max-height, opacity] duration-700 space-y-4 overflow-hidden
                ${
                    minBalance.lt(outboundTokenBalance)
                        ? " max-h-24 opacity-100 "
                        : " max-h-0 opacity-0 "
                }
            `}
            >
                <p>
                    {`If you do not cancel the ${
                        outboundToken.label
                    } stream before your balance reaches zero, you will lose your ${ethers.utils.formatEther(
                        buffer
                    )} ${outboundToken.label} buffer.`}
                </p>
                {setAcceptedBuffer && !shouldHideAcceptButton && (
                    <div className="flex space-x-2 pb-1 items-center">
                        <button
                            type="button"
                            className={`flex items-center justify-center text-white border-[2px] rounded-md w-5 h-5 ${
                                acceptedBuffer
                                    ? "border-aqueductBlue bg-aqueductBlue"
                                    : "border-red-900/90 dark:border-red-400/90"
                            }`}
                            onClick={() => {
                                setAcceptedBuffer(!acceptedBuffer);
                            }}
                            aria-label="Confirm buffer warning checkbox"
                        >
                            {acceptedBuffer && <BsCheckLg size={8} />}
                        </button>
                        <p className="text-xs">Yes, I understand the risk</p>
                    </div>
                )}
            </div>
            <div
                className={`transition-[max-height, opacity] duration-700 overflow-hidden
                ${
                    minBalance.lt(outboundTokenBalance)
                        ? " max-h-0 opacity-0 "
                        : " max-h-16 opacity-100 "
                }
            `}
            >
                {buffer.gt(outboundTokenBalance) ? (
                    <p>
                        {`You do not have enough balance to cover the ${ethers.utils.formatEther(
                            buffer
                        )} ${outboundToken.label} buffer.`}
                    </p>
                ) : (
                    <p>
                        You need to leave enough balance to stream for 2 hours.
                    </p>
                )}
            </div>
        </div>
    </div>
);

export default BufferWarning;

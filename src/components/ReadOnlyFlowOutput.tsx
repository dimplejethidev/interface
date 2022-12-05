import Image from "next/image";
import { TokenOption } from "../types/TokenOption";

interface ReadOnlyFlowOutputProps {
    displayedValue: string;
    token: TokenOption;
}

const ReadOnlyFlowOutput = ({
    displayedValue,
    token,
}: ReadOnlyFlowOutputProps) => (
    <div>
        <div
            className={
                "flex flex-col w-full border-[1px] border-gray-200 dark:border-zinc-600 centered-shadow-sm dark:centered-shadow-sm-dark rounded-2xl " +
                " px-3 py-3"
            }
        >
            <div className="flex items-center space-x-2">
                <input
                    className="bg-white px-2 text-2xl opacity-75 font-semibold monospace-font tracking-widest flex w-full h-min outline-none dark:bg-transparent dark:text-gray-300"
                    type="text"
                    pattern="^[0-9]*[.,]?[0-9]*$"
                    placeholder="0"
                    value={displayedValue}
                    disabled
                />
                <div className="flex relative flex-shrink-0 shadow-sm rounded-lg border border-gray-200 bg-white py-3 px-3 space-x-2 text-sm dark:bg-transparent dark:border-zinc-600 dark:text-gray-400">
                    <Image src={token.logo} width="20" height="20" />
                    <span className="flex items-center ">
                        <span className="block truncate">{token.label}</span>
                    </span>
                </div>
            </div>
        </div>
    </div>
);

export default ReadOnlyFlowOutput;

import { useStore } from "../store";
import { TokenOption } from "../types/TokenOption";

interface ReadOnlyFlowOutputProps {
    displayedValue: string;
    token: TokenOption;
}

const ReadOnlyFlowOutput = ({
    displayedValue,
    token
}: ReadOnlyFlowOutputProps) => {

    const store = useStore();

    return (
        <div>
            <div
                className={
                    "flex flex-col w-full border-[1px] border-gray-200 dark:border-zinc-600 centered-shadow-sm dark:centered-shadow-sm-dark rounded-2xl "
                    + " px-3 py-3"
                }
            >
                <div className={"flex items-center space-x-2"}>
                    <input
                        className={
                            "bg-white px-2 text-2xl font-semibold monospace-font tracking-widest flex w-full h-min outline-none "
                        }
                        type="text"
                        pattern="^[0-9]*[.,]?[0-9]*$"
                        placeholder="0"
                        value={displayedValue}
                        disabled={true}
                    />
                    <div className="flex relative flex-shrink-0 shadow-sm rounded-lg border border-gray-200 bg-white py-3 px-3 space-x-2 text-sm">
                        <img src={token.logo} className='w-5 h-5' />
                        <span className="flex items-center ">
                            <span className="block truncate">{token.label}</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReadOnlyFlowOutput;
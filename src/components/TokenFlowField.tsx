import { BigNumber, ethers } from "ethers";
import { useEffect } from "react";
import { useStore } from "../store";
import { GenericDropdownOption } from "../types/GenericDropdownOption";
import tokens from "../utils/tokens";
import Select from "./Select";

interface TokenFlowFieldProps {
    title: string;
    displayedValue: string;
    setDisplayedValue: (number: string) => void;
    formattedValue: string;
    setFormattedValue: (number: string) => void;
    dropdownItems?: GenericDropdownOption[];
    dropdownValue?: GenericDropdownOption;
    setDropdownValue?: (value: GenericDropdownOption) => void;
    isEther: boolean;
    isOutboundToken: boolean;
    shouldReformat: boolean;
    currentBalance: BigNumber;
}

const TokenFlowField = ({
    title,
    displayedValue,
    setDisplayedValue,
    formattedValue,
    setFormattedValue,
    dropdownItems,
    dropdownValue,
    setDropdownValue,
    isEther,
    isOutboundToken,
    shouldReformat,
    currentBalance
}: TokenFlowFieldProps) => {

    const store = useStore();

    function setFormattedNumber(newValue: string) {
        if (newValue == '') { setFormattedValue(''); return; }

        if (newValue.match("^[0-9]*[.]?[0-9]*$") != null && newValue != '.') {
            var formattedValue = isEther ? ethers.utils.parseUnits(newValue, "ether") : BigNumber.from(newValue);
            formattedValue = formattedValue.div(store.flowrateUnit.value)
            setFormattedValue(formattedValue.toString());
        }
    }

    useEffect(() => {
        if (shouldReformat) {
            setFormattedNumber(displayedValue);
        }
    }, [store.flowrateUnit])

    return (
        <div>
            <div
                className={
                    "hover:border-aqueductBlue focus-within:textbox-outline flex flex-col grow border-[1px] border-gray-200 dark:border-zinc-600 centered-shadow-sm dark:centered-shadow-sm-dark rounded-2xl "
                    + " px-3 py-3"
                }
            >
                <div className={"flex items-end space-x-2"}>
                    <input
                        className={
                            "bg-blue-100/502 px-2 pb-2 text-3xl font-semibold monospace-font tracking-widest flex w-full h-min outline-none "
                        }
                        type="text"
                        pattern="^[0-9]*[.,]?[0-9]*$"
                        placeholder="0"
                        value={displayedValue}
                        onChange={(e) => {
                            // set displayed value
                            if (e.target.value.match("^[0-9]*[.]?[0-9]*$") != null) {
                                setDisplayedValue(e.target.value);
                            }

                            // set formatted number
                            setFormattedNumber(e.target.value);
                        }}
                    />
                    {
                        dropdownItems && dropdownValue && setDropdownValue &&
                        <Select options={dropdownItems} dropdownValue={dropdownValue} setDropdownValue={setDropdownValue} />
                    }
                    <Select
                        options={tokens}
                        dropdownValue={isOutboundToken ? store.outboundToken : store.inboundToken}
                        setDropdownValue={isOutboundToken ? store.setOutboundToken : store.setInboundToken}
                    />
                </div>
                <div className="flex justify-end2 pt-3 pb-2 px-2 text-xs space-x-2">
                    <p>
                        Balance:
                    </p>
                    <p className='monospace-font tracking-wider'>
                        {ethers.utils.formatEther(currentBalance).substring(0, 15)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TokenFlowField;
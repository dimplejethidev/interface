import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import { useStore } from "../store";
import { GenericDropdownOption } from "../types/GenericDropdownOption";
import GenericDropdown from "./GenericDropdown";

interface NumberEntryFieldProps {
    title: string;
    number: string;
    setNumber: (number: string) => void;
    dropdownItems?: GenericDropdownOption[];
    dropdownValue?: GenericDropdownOption;
    setDropdownValue?: (value: GenericDropdownOption) => void;
    isEther: boolean;
}

const NumberEntryField = ({
    title,
    number,
    setNumber,
    dropdownItems,
    dropdownValue,
    setDropdownValue,
    isEther
}: NumberEntryFieldProps) => {

    const store = useStore();
    const [value, setValue] = useState<string>('');

    function setFormattedNumber(newValue: string) {
        if (newValue == '') { setNumber(''); return; }

        if (newValue.match("^[0-9]*[.]?[0-9]*$") != null) {
            var formattedValue = isEther ? ethers.utils.parseUnits(newValue, "ether") : BigNumber.from(newValue);
            console.log(formattedValue.toString())
            if (dropdownItems && dropdownValue && setDropdownValue) {
                formattedValue = formattedValue.div(store.flowrateUnit.value)
            }
            console.log(formattedValue.toString())
            setNumber(formattedValue.toString());
        }
    }

    useEffect(() => {
        setFormattedNumber(value);
    }, [store.flowrateUnit])

    return (
        <div>
            <div className="absolute pl-6 pt-4 text-xs font-semibold">
                {title}
            </div>
            <div className="flex h-[5.5rem] grow bg-white2 border-[1px] border-gray-200 centered-shadow-sm rounded-2xl ">
                <input
                    className="px-6 pt-7 mr-[0.1rem] text-2xl font-semibold monospace-font tracking-widest rounded-l-2xl rounded-r-none flex w-full 
                                 outline-none focus:textbox-outline hover:border-[1px] hover:border-aqueductBlue hover:pl-[23px]"
                    type="text"
                    pattern="^[0-9]*[.,]?[0-9]*$"
                    placeholder="0"
                    value={value}
                    onChange={(e) => {
                        // set displayed value
                        if (e.target.value.match("^[0-9]*[.]?[0-9]*$") != null) {
                            setValue(e.target.value);
                        }

                        // set formatted number
                        setFormattedNumber(e.target.value);
                    }}
                />
                {
                    dropdownItems && dropdownValue && setDropdownValue &&
                    <GenericDropdown options={dropdownItems} dropdownValue={dropdownValue} setDropdownValue={setDropdownValue} />
                }
            </div>
        </div>
    );
};

export default NumberEntryField;

//hover:border-[1px] hover:border-aqueductBlue focus:hover:border-2 focus:border-[1px] focus:border-aqueductBlue hover:
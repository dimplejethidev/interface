/* eslint-disable react/require-default-props */
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import { useStore } from "../store";
import { GenericDropdownOption } from "../types/GenericDropdownOption";
import GenericDropdown from "./GenericDropdown";

interface NumberEntryFieldProps {
    title: string;
    setNumber: (number: string) => void;
    dropdownItems?: GenericDropdownOption[];
    dropdownValue?: GenericDropdownOption;
    setDropdownValue?: (value: GenericDropdownOption) => void;
    isEther: boolean;
}

const NumberEntryField = ({
    title,
    setNumber,
    dropdownItems,
    dropdownValue,
    setDropdownValue,
    isEther,
}: NumberEntryFieldProps) => {
    const store = useStore();
    const [value, setValue] = useState<string>("");

    function setFormattedNumber(newValue: string) {
        if (newValue === "") {
            setNumber("");
            return;
        }

        if (newValue.match("^[0-9]*[.]?[0-9]*$") != null && newValue !== ".") {
            let formattedValue = isEther
                ? ethers.utils.parseUnits(newValue, "ether")
                : BigNumber.from(newValue);
            if (dropdownItems && dropdownValue && setDropdownValue) {
                formattedValue = formattedValue.div(store.flowrateUnit.value);
            }
            setNumber(formattedValue.toString());
        }
    }

    useEffect(() => {
        setFormattedNumber(value);
        // TODO: Assess missing dependency array values
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store.flowrateUnit]);

    return (
        <div>
            <div className="absolute pl-6 pt-4 text-xs font-semibold">
                {title}
            </div>
            <div className="flex h-[5.5rem] grow border-[1px] border-gray-200 dark:border-zinc-600 centered-shadow-sm dark:centered-shadow-sm-dark rounded-2xl ">
                <input
                    className={
                        `px-6 pt-7 mr-[0.1rem] text-2xl font-semibold monospace-font tracking-widest rounded-l-2xl rounded-r-none flex w-full dark:bg-zinc-900 ` +
                        `outline-none focus:textbox-outline hover:border-[1px] hover:border-aqueductBlue hover:pl-[23px]${
                            !dropdownItems && " rounded-r-2xl "
                        }`
                    }
                    type="text"
                    pattern="^[0-9]*[.,]?[0-9]*$"
                    placeholder="0"
                    value={value}
                    onChange={(e) => {
                        // set displayed value
                        if (
                            e.target.value.match("^[0-9]*[.]?[0-9]*$") != null
                        ) {
                            setValue(e.target.value);
                        }

                        // set formatted number
                        setFormattedNumber(e.target.value);
                    }}
                />
                {dropdownItems && dropdownValue && setDropdownValue && (
                    <GenericDropdown
                        options={dropdownItems}
                        dropdownValue={dropdownValue}
                        setDropdownValue={setDropdownValue}
                    />
                )}
            </div>
        </div>
    );
};

export default NumberEntryField;

import { GenericDropdownOption } from "../types/GenericDropdownOption";
import GenericDropdown from "./GenericDropdown";

interface NumberEntryFieldProps {
    title: string;
    number: string;
    setNumber: (number: string) => void;
    dropdownItems?: GenericDropdownOption[];
    dropdownValue?: GenericDropdownOption;
    setDropdownValue?: (value: GenericDropdownOption) => void;
}

const NumberEntryField = ({
    title,
    number,
    setNumber,
    dropdownItems,
    dropdownValue,
    setDropdownValue
}: NumberEntryFieldProps) => {
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
                    value={number}
                    onChange={(e) => {
                        if (e.target.value.match("^[0-9]*[.]?[0-9]*$") != null) {
                            setNumber(e.target.value);
                        }
                    }}
                />
                {
                    dropdownItems && dropdownValue && setDropdownValue &&
                    <GenericDropdown options={dropdownItems} dropdownValue={dropdownValue} setDropdownValue={setDropdownValue}/>
                }
            </div>
        </div>
    );
};

export default NumberEntryField;

//hover:border-[1px] hover:border-aqueductBlue focus:hover:border-2 focus:border-[1px] focus:border-aqueductBlue hover:
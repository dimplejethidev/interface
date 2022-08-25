import { Token } from "../types/Token";

interface DropdownProps {
    dropdownItems: Token[];
}

const Dropdown = ({ dropdownItems }: DropdownProps) => {

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    };

    return (
        <select
            className="h-20 text-2xl w-full pt-6 mt-2 font-semibold bg-black/10 rounded-2xl px-4 numbers-font-2 text-slate-500"
            onChange={handleChange}
        >
            {dropdownItems.map((item, index) => (
                <option value={item} key={index}>
                    {Token[item].toString()}
                </option>
            ))}
        </select>
    );
};

export default Dropdown;

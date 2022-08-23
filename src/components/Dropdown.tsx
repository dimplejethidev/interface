import { useState } from "react";

interface DropdownProps {
    dropdownItems: string[];
    setPool: (pool: string) => void;
}

const Dropdown = ({ dropdownItems, setPool }: DropdownProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPool(e.target.value);
    };

    return (
        <select
            className="relative h-20 text-2xl w-full pt-6 font-semibold bg-black/10 rounded-2xl px-4 numbers-font-2"
            onChange={handleChange}
        >
            {dropdownItems.map((item, index) => (
                <option value={index}>{item}</option>
            ))}
        </select>
    );
};

export default Dropdown;

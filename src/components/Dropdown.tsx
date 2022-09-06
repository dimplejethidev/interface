import Token from "../types/Token";

interface DropdownProps {
    title?: string;
    dropdownItems: Token[];
    setToken: (token: Token) => void;
}

const Dropdown = ({ title, dropdownItems, setToken }: DropdownProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setToken(e.target.value as Token);
    };

    return (
        <div>
            {
                <div className="absolute pl-4 pt-5 text-xs font-semibold">
                    {title}
                </div>
            }
            <select
                className={`${title && "pt-8"} h-21 text-2xl w-full mt-2 font-semibold bg-white border-[1px] centered-shadow-sm rounded-2xl px-4 py-3 numbers-font-2 text-slate-500`}
                onChange={handleChange}
            >
                {dropdownItems.map((item) => (
                    <option value={Token[item]} key={item}>
                        {Token[item].toString()}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Dropdown;

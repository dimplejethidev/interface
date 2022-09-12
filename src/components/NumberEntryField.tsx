interface NumberEntryFieldProps {
    title: string;
    number: string;
    setNumber: (number: string) => void;
}

const NumberEntryField = ({
    title,
    number,
    setNumber,
}: NumberEntryFieldProps) => {
    return (
        <div>
            <div className="absolute pl-6 pt-4 text-xs font-semibold">
                {title}
            </div>
            <input
                className="h-[5.5rem] text-2xl w-full pt-7 font-semibold bg-white border-[1px] border-gray-200 centered-shadow-sm rounded-2xl px-6 monospace-font tracking-widest"
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
        </div>
    );
};

export default NumberEntryField;

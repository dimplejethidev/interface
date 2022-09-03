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
            <div className="absolute pl-4 pt-3 text-xs font-semibold">
                {title}
            </div>
            <input
                className="h-20 text-2xl w-full pt-6 font-semibold bg-white border-[1px] centered-shadow-sm rounded-2xl px-4 numbers-font-2"
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

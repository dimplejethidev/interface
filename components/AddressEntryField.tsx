interface AddressEntryFieldProps {
    title: string;
    address: string;
    setAddress: (address: string) => void;
}

const AddressEntryField = ({
    title,
    address,
    setAddress,
}: AddressEntryFieldProps) => {
    return (
        <div className="bg-gray-700 rounded-2xl">
            <div className="absolute pl-4 pt-3 text-xs font-semibold">
                {title}
            </div>
            <input
                className="h-20 text-2xl w-full pt-6 font-semibold bg-white/5 rounded-2xl px-4 numbers-font-2"
                type="text"
                placeholder="ex: 0xabc123..."
                value={address}
                onChange={(e) => {
                    setAddress(e.target.value);
                }}
            />
        </div>
    );
};

export default AddressEntryField;

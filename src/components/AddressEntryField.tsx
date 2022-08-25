import Dropdown from "./Dropdown";
import { Token } from "../types/Token";

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
        <div>
            <div className="absolute pl-4 pt-5 text-xs font-semibold">
                Outbound token
            </div>
            <Dropdown
                dropdownItems={[Token.ETHxp, Token.fDAIxp]}
            />
            <div className="absolute pl-4 pt-5 text-xs font-semibold">
                Inbound token
            </div>
            <Dropdown
                dropdownItems={[Token.fDAIxp, Token.ETHxp]}
            />
        </div>
    );
};

export default AddressEntryField;

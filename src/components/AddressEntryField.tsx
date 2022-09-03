import Dropdown from "./Dropdown";
import Token from "../types/Token";
import { useStore } from "../store";

const AddressEntryField = () => {
    const store = useStore();

    return (
        <div>
            <div className="absolute pl-4 pt-5 text-xs font-semibold">
                Outbound token
            </div>
            <Dropdown
                dropdownItems={[Token.ETHxp, Token.fDAIxp]}
                setToken={store.setOutboundToken}
            />
            <div className="absolute pl-4 pt-5 text-xs font-semibold">
                Inbound token
            </div>
            <Dropdown
                dropdownItems={[Token.fDAIxp, Token.ETHxp]}
                setToken={store.setInboundToken}
            />
        </div>
    );
};

export default AddressEntryField;

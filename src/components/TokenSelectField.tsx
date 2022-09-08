import Dropdown from "./Dropdown";
import Token from "../types/Token";
import { useStore } from "../store";

const TokenSelectField = () => {
    const store = useStore();

    return (
        <div>
            <Dropdown
                title='Outbound token'
                dropdownItems={[Token.fDAIxp, Token.fUSDCxp]}
                setToken={store.setOutboundToken}
            />
            <Dropdown
                title='Inbound token'
                dropdownItems={[Token.fUSDCxp, Token.fDAIxp]}
                setToken={store.setInboundToken}
            />
        </div>
    );
};

export default TokenSelectField;

import { useStore } from "../store";
import TokenDropdown from "./TokenDropdown";

const TokenSelectField = () => {
    const store = useStore();

    return (
        <div>
            <TokenDropdown
                selectTokenOption={store.outboundToken}
                setToken={store.setOutboundToken}
            />
            <TokenDropdown
                selectTokenOption={store.inboundToken}
                setToken={store.setInboundToken}
            />
        </div>
    );
};

export default TokenSelectField;

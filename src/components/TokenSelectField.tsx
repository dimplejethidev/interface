import { IoArrowDown } from "react-icons/io5";
import { useStore } from "../store";
import TokenDropdown from "./TokenDropdown";
import { TokenOption } from "../types/TokenOption";

// TODO: Remove
const TokenSelectField = () => {
    const store = useStore();

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full py-1">
                <TokenDropdown
                    selectTokenOption={store.outboundToken}
                    setToken={store.setOutboundToken}
                />
            </div>
            <div className="w-full py-1">
                <TokenDropdown
                    selectTokenOption={store.inboundToken}
                    setToken={store.setInboundToken}
                />
            </div>
            <button
                type="button"
                className="absolute flex items-center justify-center w-10 h-10 bg-white rounded-xl border-[1px] centered-shadow-sm"
                onClick={() => {
                    const oldOutbound: TokenOption = store.outboundToken;
                    store.setOutboundToken(store.inboundToken);
                    store.setInboundToken(oldOutbound);
                }}
            >
                <IoArrowDown size={20} />
            </button>
        </div>
    );
};

export default TokenSelectField;

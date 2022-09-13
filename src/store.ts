import create from "zustand";
import Token from "./types/Token";
import { TokenOption } from "./types/TokenOption";
import tokens from "./utils/tokens";

interface StoreState {
    outboundToken: TokenOption;
    inboundToken: TokenOption;
    upgradeDowngradeToken: TokenOption;
    selectedToken: Token;
    setOutboundToken: (token: TokenOption) => void;
    setInboundToken: (token: TokenOption) => void;
    setUpgradeDowngradeToken: (token: TokenOption) => void;
    setSelectedToken: (token: Token) => void;
}

export const useStore = create<StoreState>()((set) => ({
    outboundToken: tokens.find((t) => t.value == Token.fDAIxp)!,
    inboundToken: tokens.find((t) => t.value == Token.fUSDCxp)!,
    upgradeDowngradeToken: tokens.find((t) => t.value == Token.fDAIxp)!,
    selectedToken: Token.fDAIxp,
    setOutboundToken: (outboundToken: TokenOption) =>
        set((state) => ({ ...state, outboundToken })),
    setInboundToken: (inboundToken: TokenOption) =>
        set((state) => ({ ...state, inboundToken })),
    setUpgradeDowngradeToken: (upgradeDowngradeToken: TokenOption) =>
        set((state) => ({ ...state, upgradeDowngradeToken })),
    setSelectedToken: (selectedToken: Token) =>
        set((state) => ({ ...state, selectedToken })),
}));

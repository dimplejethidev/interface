import create from "zustand";
import { IBalance, initialBalance } from "./types/Balance";
import Token from "./types/Token";
import daiLogo from "./../public/dai-logo.png";
import usdcLogo from "./../public/usdc-logo.png";
import { TokenOption } from "./types/TokenOption";
import { fDAIxp, fUSDCxp } from "./utils/constants";
import tokens from "./utils/tokens";

interface StoreState {
    account: string;
    balance: IBalance;
    outboundToken: TokenOption;
    inboundToken: TokenOption;
    upgradeDowngradeToken: TokenOption;
    selectedToken: Token;
    setAccount: (account: string) => void;
    setBalance: (balance: IBalance) => void;
    setOutboundToken: (token: TokenOption) => void;
    setInboundToken: (token: TokenOption) => void;
    setUpgradeDowngradeToken: (token: TokenOption) => void;
    setSelectedToken: (token: Token) => void;
}

export const useStore = create<StoreState>()((set) => ({
    account: "",
    balance: initialBalance,
    outboundToken: tokens.find(t => t.value == Token.fDAIxp)!,
    inboundToken: tokens.find(t => t.value == Token.fUSDCxp)!,
    upgradeDowngradeToken: tokens.find(t => t.value == Token.fDAIxp)!,
    selectedToken: Token.fDAIxp,
    setAccount: (account: string) => set((state) => ({ ...state, account })),
    setBalance: (balance: IBalance) => set((state) => ({ ...state, balance })),
    setOutboundToken: (outboundToken: TokenOption) =>
        set((state) => ({ ...state, outboundToken })),
    setInboundToken: (inboundToken: TokenOption) =>
        set((state) => ({ ...state, inboundToken })),
    setUpgradeDowngradeToken: (upgradeDowngradeToken: TokenOption) =>
        set((state) => ({ ...state, upgradeDowngradeToken })),
    setSelectedToken: (selectedToken: Token) =>
        set((state) => ({ ...state, selectedToken })),
}));

import create from "zustand";
import { IBalance, initialBalance } from "./types/Balance";
import Token from "./types/Token";
import daiLogo from "./../public/dai-logo.png";
import usdcLogo from "./../public/usdc-logo.png";
import { TokenOption } from "./types/TokenOption";

interface StoreState {
    account: string;
    balance: IBalance;
    outboundToken: TokenOption;
    inboundToken: TokenOption;
    selectedToken: Token;
    setAccount: (account: string) => void;
    setBalance: (balance: IBalance) => void;
    setOutboundToken: (token: TokenOption) => void;
    setInboundToken: (token: TokenOption) => void;
    setSelectedToken: (token: Token) => void;
}

export const useStore = create<StoreState>()((set) => ({
    account: "",
    balance: initialBalance,
    outboundToken: {
        label: "fDAIxp",
        value: Token.fDAIxp,
        imgUrl: daiLogo.src,
    },
    inboundToken: {
        label: "fUSDCxp",
        value: Token.fUSDCxp,
        imgUrl: usdcLogo.src,
    },
    selectedToken: Token.fDAIxp,
    setAccount: (account: string) => set((state) => ({ ...state, account })),
    setBalance: (balance: IBalance) => set((state) => ({ ...state, balance })),
    setOutboundToken: (outboundToken: TokenOption) =>
        set((state) => ({ ...state, outboundToken })),
    setInboundToken: (inboundToken: TokenOption) =>
        set((state) => ({ ...state, inboundToken })),
    setSelectedToken: (selectedToken: Token) =>
        set((state) => ({ ...state, selectedToken })),
}));

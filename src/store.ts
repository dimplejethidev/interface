import create from "zustand";
import { IBalance, initialBalance } from "./types/Balance";
import Token from "./types/Token";

interface StoreState {
    account: string;
    balance: IBalance;
    outboundToken: Token;
    inboundToken: Token;
    selectedToken: Token;
    setAccount: (account: string) => void;
    setBalance: (balance: IBalance) => void;
    setOutboundToken: (token: Token) => void;
    setInboundToken: (token: Token) => void;
    setSelectedToken: (token: Token) => void;
}

export const useStore = create<StoreState>()((set) => ({
    account: "",
    balance: initialBalance,
    outboundToken: Token.ETHxp,
    inboundToken: Token.fDAIxp,
    setAccount: (account: string) => set((state) => ({ ...state, account })),
    setBalance: (balance: IBalance) => set((state) => ({ ...state, balance })),
    setOutboundToken: (outboundToken: Token) =>
        set((state) => ({ ...state, outboundToken })),
    setInboundToken: (inboundToken: Token) =>
        set((state) => ({ ...state, inboundToken })),
    setSelectedToken: (selectedToken: Token) =>
        set((state) => ({ ...state, selectedToken })),
}));

import create from "zustand";
import { Token } from "./types/Token";

interface StoreState {
    account: string;
    outboundToken: Token;
    inboundToken: Token;
    setAccount: (account: string) => void;
    setOutboundToken: (token: Token) => void;
    setInboundToken: (token: Token) => void;
}

export const useStore = create<StoreState>()((set) => ({
    account: "",
    outboundToken: Token.ETHxp,
    inboundToken: Token.fDAIxp,
    setAccount: (account: string) => set((state) => ({ ...state, account })),
    setOutboundToken: (outboundToken: Token) =>
        set((state) => ({ ...state, outboundToken })),
    setInboundToken: (inboundToken: Token) =>
        set((state) => ({ ...state, inboundToken })),
}));

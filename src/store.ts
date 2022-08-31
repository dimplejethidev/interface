import create from "zustand";
import { Token } from "./types/Token";

interface SwapState {
    outboundToken: Token;
    inboundToken: Token;
    setOutboundToken: (token: Token) => void;
    setInboundToken: (token: Token) => void;
}

export const useStore = create<SwapState>()((set) => ({
    outboundToken: Token.ETHxp,
    inboundToken: Token.fDAIxp,
    setOutboundToken: (token: Token) => set(() => ({ outboundToken: token })),
    setInboundToken: (token: Token) => set(() => ({ inboundToken: token })),
}));

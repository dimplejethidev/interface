import Token from "../types/Token";
import { ETHxp, fDAI, fDAIxp, fUSDC, fUSDCxp } from "../utils/constants";

interface TokenData {
    name: string;
    address: string;
    underlyingToken: string;
}

const tokens = new Map<string, TokenData>([
    [Token.ETHxp, { name: Token.ETHxp, address: ETHxp, underlyingToken: '0x0' }],
    [Token.fDAIxp, { name: Token.fDAIxp, address: fDAIxp, underlyingToken: fDAI }],
    [Token.fUSDCxp, { name: Token.fUSDCxp, address: fUSDCxp, underlyingToken: fUSDC }]
])

export default tokens;
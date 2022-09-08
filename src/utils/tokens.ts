import Token from "../types/Token";
import { ETHxp, fDAIxp, fUSDCxp } from "../utils/constants";

interface TokenData {
    name: string;
    address: string;
}

const tokens = new Map<string, TokenData>([
    [Token.ETHxp, { name: Token.ETHxp, address: ETHxp }],
    [Token.fDAIxp, { name: Token.fDAIxp, address: fDAIxp }],
    [Token.fUSDCxp, { name: Token.fUSDCxp, address: fUSDCxp }]
])

export default tokens;
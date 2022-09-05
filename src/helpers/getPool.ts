import Token from "../types/Token";
import { ETHxpfDAIxpPool, fDAIxpETHxpPool } from "./../utils/constants";

const getPoolAddress = (outboundToken: Token, inboundToken: Token) => {
    let pool: string;

    switch (true) {
        case inboundToken === Token.ETHxp && outboundToken === Token.fDAIxp:
            pool = ETHxpfDAIxpPool;
            break;
        case inboundToken === Token.fDAIxp && outboundToken === Token.ETHxp:
            pool = fDAIxpETHxpPool;
            break;
        default:
            throw new Error(
                `Pool not found for tokens "${outboundToken}" and "${inboundToken}"`
            );
    }

    return pool;
};

export default getPoolAddress;

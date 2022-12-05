import Token from "../types/Token";
import {
    ETHxpfDAIxpPool,
    fDAIxpETHxpPool,
    fDAIxpfUSDCxpPool,
} from "../utils/constants";

const getPoolAddress = (outboundToken: Token, inboundToken: Token) => {
    let pool: string;

    switch (true) {
        case inboundToken === Token.ETHxp && outboundToken === Token.fDAIxp:
            pool = ETHxpfDAIxpPool;
            break;
        case inboundToken === Token.fDAIxp && outboundToken === Token.ETHxp:
            pool = fDAIxpETHxpPool;
            break;
        case inboundToken === Token.fDAIxp && outboundToken === Token.fUSDCxp:
            pool = fDAIxpfUSDCxpPool;
            break;
        case inboundToken === Token.fUSDCxp && outboundToken === Token.fDAIxp:
            pool = fDAIxpfUSDCxpPool;
            break;
        default:
            throw new Error(
                `Pool not found for tokens "${outboundToken}" and "${inboundToken}"`
            );
    }

    return pool;
};

export default getPoolAddress;

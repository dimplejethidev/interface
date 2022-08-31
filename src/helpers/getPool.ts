import Token from "../types/Token";

const getPoolAddress = (outboundToken: Token, inboundToken: Token) => {
    let pool: string;

    switch (true) {
        case inboundToken === Token.ETHxp && outboundToken === Token.fDAIxp:
            pool = "0x1";
            break;
        case inboundToken === Token.fDAIxp && outboundToken === Token.ETHxp:
            pool = "0x2";
            break;
        default:
            throw new Error(
                `Pool not found for tokens "${outboundToken}" and "${inboundToken}"`
            );
    }

    return pool;
};

export default getPoolAddress;

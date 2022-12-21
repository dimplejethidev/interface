import Token from "../types/Token";
import { TokenOption } from "../types/TokenOption";
import { ETHxp, fDAI, fDAIxp, fUSDC, fUSDCxp } from "./constants";

import ethLogo from "../../public/eth-logo.png";
import daiLogo from "../../public/dai-logo.png";
import usdcLogo from "../../public/usdc-logo.png";

const tokens: TokenOption[] = [
    /*
    {
        label: "ETHxp",
        value: Token.ETHxp,
        logo: ethLogo.src,
        address: ETHxp,
        underlyingToken: {
            label: "ETH",
            value: Token.ETH,
            logo: ethLogo.src,
            address: "0x0",
            colorHex: "#00ABEE",
        },
        colorHex: "#00ABEE",
    },
    */
    {
        label: "fDAIxp",
        value: Token.fDAIxp,
        logo: daiLogo.src,
        address: fDAIxp,
        underlyingToken: {
            label: "fDAI",
            value: Token.fDAI,
            logo: daiLogo.src,
            address: fDAI,
            colorHex: "#F5AC37",
        },
        colorHex: "#F5AC37",
    },
    {
        label: "fUSDCxp",
        value: Token.fUSDCxp,
        logo: usdcLogo.src,
        address: fUSDCxp,
        underlyingToken: {
            label: "fUSDC",
            value: Token.fUSDC,
            logo: usdcLogo.src,
            address: fUSDC,
            colorHex: "#2775CA",
        },
        colorHex: "#2775CA",
    },
];

export default tokens;

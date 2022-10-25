import Token from "../types/Token";
import { TokenOption } from "../types/TokenOption";
import { ETHxp, fDAI, fDAIxp, fUSDC, fUSDCxp } from "../utils/constants";

import ethLogo from "./../../public/eth-logo.png";
import daiLogo from "./../../public/dai-logo.png";
import usdcLogo from "./../../public/usdc-logo.png";

const tokens: TokenOption[] = [
    {
        label: "ETHxp",
        value: Token.ETHxp,
        logo: ethLogo.src,
        address: ETHxp,
        underlyingToken: '0x0',
        colorHex: '#00ABEE'
    },
    {
        label: "fDAIxp",
        value: Token.fDAIxp,
        logo: daiLogo.src,
        address: fDAIxp,
        underlyingToken: fDAI,
        colorHex: '#F5AC37'
    },
    {
        label: "fUSDCxp",
        value: Token.fUSDCxp,
        logo: usdcLogo.src,
        address: fUSDCxp,
        underlyingToken: fUSDC,
        colorHex: '#2775CA'
    },
];

export default tokens;
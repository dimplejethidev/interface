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
        underlyingToken: '0x0'
    },
    {
        label: "fDAIxp",
        value: Token.fDAIxp,
        logo: daiLogo.src,
        address: fDAIxp,
        underlyingToken: fDAI
    },
    {
        label: "fUSDCxp",
        value: Token.fUSDCxp,
        logo: usdcLogo.src,
        address: fUSDCxp,
        underlyingToken: fUSDC
    },
];

export default tokens;
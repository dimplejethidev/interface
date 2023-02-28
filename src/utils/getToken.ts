import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import Token from "../types/Token";
import { TokenOption } from "../types/TokenOption";
import tokens from "./tokens";

interface GetTokenArgs {
    tokenAddress: string;
    provider: ethers.providers.Provider;
    chainId: number;
}

const getToken = async ({
    tokenAddress,
    provider,
    chainId,
}: GetTokenArgs): Promise<TokenOption> => {
    const token = tokens.find((t) => t.address === tokenAddress);
    if (token) {
        return token;
    }

    // if didn't find listed token, create object for unlisted token
    const sf = await Framework.create({
        chainId,
        provider,
    });
    const superToken = await sf.loadSuperToken(tokenAddress);
    const tokenName = await superToken.name({ providerOrSigner: provider });

    return {
        label: tokenName,
        value: Token.unlisted,
        logo: "",
        address: tokenAddress,
        colorHex: "",
    };

    // TODO: Do we need error handling here?
};

export default getToken;

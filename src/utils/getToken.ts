import { Framework } from "@superfluid-finance/sdk-core";
import { Provider } from "@wagmi/core";
import { useNetwork, useProvider } from "wagmi";
import Token from "../types/Token";
import { TokenOption } from "../types/TokenOption";
import tokens from "./tokens";

const getToken = async ({ tokenAddress, provider, chainId }: { tokenAddress: string, provider: Provider, chainId: number }): Promise<TokenOption | undefined> => {
    const token = tokens.find((t) => t.address == tokenAddress);
    if (token) { return token; }

    // if didn't find listed token, create object for unlisted token
    try {
        const sf = await Framework.create({
            chainId: chainId,
            provider
        });
        const superToken = await sf.loadSuperToken(tokenAddress);
        const tokenName = await superToken.name({ providerOrSigner: provider });

        return {
            label: tokenName,
            value: Token.unlisted,
            logo: "",
            address: tokenAddress,
            colorHex: ""
        }
    } catch {
        return;
    }
}

export default getToken;
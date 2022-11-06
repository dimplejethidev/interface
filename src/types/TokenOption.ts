import Token from "./Token";

export type TokenOption = {
    label: string;
    value: Token;
    logo: string;
    address: string;
    underlyingToken?: TokenOption;
    colorHex: string;
};

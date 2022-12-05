const getSharedLink = (
    network: string,
    userAddress: string,
    token0Address: string,
    token1Address: string
) =>
    `aqueductfinance.vercel.app/pair/${network}/${userAddress}/${token0Address}/${token1Address}`;

export default getSharedLink;

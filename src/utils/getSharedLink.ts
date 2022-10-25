const getSharedLink = (network: string, userAddress: string, token0Address: string, token1Address: string) => {
    return (
        'localhost:3000/pair/' + network + '/' + userAddress + '/' + token0Address + '/' + token1Address
    )
}

export default getSharedLink;
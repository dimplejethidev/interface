import type { NextPage } from "next";
import Header from "../components/Header";

interface ProvideLiquidityProps {
    account: string;
}

const ProvideLiquidity: NextPage<ProvideLiquidityProps> = ({ account }) => {
    return (
        <div>
            <Header account={account} />
            provide liquidity
        </div>
    );
};

export default ProvideLiquidity;

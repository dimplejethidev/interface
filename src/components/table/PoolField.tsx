import Image from "next/image";
import { TokenOption } from "../../types/TokenOption";

const PoolField = ({
    token0,
    token1,
}: {
    token0: TokenOption;
    token1: TokenOption;
}) => (
    <div
        className="flex items-center h-6 relative"
        aria-label="Table pool label"
    >
        <div className="-mr-2 rounded drop-shadow-lg">
            <Image src={token0.logo} className="z-10 " width="28" height="28" />
        </div>
        <div className="rounded drop-shadow-lg">
            <Image src={token1.logo} width="28" height="28" />
        </div>

        <div className="flex text-sm pl-4 space-x-1 monospace-font font-semibold">
            <p>{token0.label}</p>
            <p>/</p>
            <p>{token1.label}</p>
        </div>
    </div>
);

export default PoolField;

import { TokenOption } from "../../types/TokenOption";

const PoolField = ({
    token0,
    token1,
}: {
    token0: TokenOption;
    token1: TokenOption;
}) => (
    <div className="flex items-center h-6 -space-x-2">
        {/* TODO: use Image */}
        {/* <Image
            src={token0.logo}
            className="z-10 drop-shadow-lg"
            width="28"
            height="28"
        />
        <Image
            src={token1.logo}
            className="drop-shadow-lg"
            width="28"
            height="28"
        /> */}
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={token0.logo} className="h-7 z-10 drop-shadow-lg" />
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={token1.logo} className="h-7 drop-shadow-lg" />
        <div className="flex text-sm pl-4 space-x-1 monospace-font font-semibold">
            <p>{token0.label}</p>
            <p>/</p>
            <p>{token1.label}</p>
        </div>
    </div>
);

export default PoolField;

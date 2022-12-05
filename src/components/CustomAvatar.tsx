import { AvatarComponent } from "@rainbow-me/rainbowkit";
import makeBlockie from "ethereum-blockies-base64";
import Image from "next/image";

export declare type AvatarComponentProps = {
    address: string;
    // eslint-disable-next-line react/require-default-props
    ensImage?: string | null;
    size: number;
};

const CustomAvatar: AvatarComponent = ({
    address,
    ensImage,
    size,
}: AvatarComponentProps) =>
    ensImage ? (
        <Image
            src={ensImage}
            width={size * 0.75}
            height={size * 0.75}
            style={{ borderRadius: 12 }}
        />
    ) : (
        <Image
            src={makeBlockie(address)}
            width={size * 0.75}
            height={size * 0.75}
            style={{ borderRadius: 12 }}
        />
    );

export default CustomAvatar;

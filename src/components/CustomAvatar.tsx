import { AvatarComponent } from "@rainbow-me/rainbowkit";
import makeBlockie from "ethereum-blockies-base64";

const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => {
    return ensImage ? (
        <img
            src={ensImage}
            width={size * 0.75}
            height={size * 0.75}
            style={{ borderRadius: 12 }}
        />
    ) : (
        <img
            src={makeBlockie(address)}
            width={size * 0.75}
            height={size * 0.75}
            style={{ borderRadius: 12 }}
        />
    );
};

export default CustomAvatar;

/* eslint-disable react/require-default-props */
import { BiLinkExternal } from "react-icons/bi";

interface ToastProps {
    message: string;
    transactionHash?: string;
}

const ToastMessage = ({ message, transactionHash }: ToastProps) => {
    if (transactionHash) {
        return (
            <p className="flex row items-start justify-between mr-2">
                {message}
                <a
                    href={`https://goerli.etherscan.io/tx/${transactionHash}`}
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    <BiLinkExternal
                        fontSize="1.5rem"
                        className="absolute right-4"
                    />
                </a>
            </p>
        );
    }

    return <p>{message}</p>;
};

export default ToastMessage;

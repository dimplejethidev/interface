import { ConnectButton } from "@rainbow-me/rainbowkit";
import { IoMdWallet } from "react-icons/io";
import { TbRefresh } from "react-icons/tb";
import makeBlockie from "ethereum-blockies-base64";

const CustomWalletConnectButton = () => {
    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
            }) => {
                // Note: If your app doesn't use authentication, you
                // can remove all 'authenticationStatus' checks
                const ready = mounted && authenticationStatus !== "loading";
                const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                        authenticationStatus === "authenticated");

                return (
                    <div
                        {...(!ready && {
                            "aria-hidden": true,
                            style: {
                                opacity: 0,
                                pointerEvents: "none",
                                userSelect: "none",
                            },
                        })}
                    >
                        {(() => {
                            if (!connected) {
                                return (
                                    <button
                                        onClick={openConnectModal}
                                        type="button"
                                        className="flex justify-start items-center space-x-2 w-full rounded-xl bg-aqueductBlue p-4 md:p-2 text-white "
                                    >
                                        <div className="p-2 rounded-lg bg-white/10">
                                            <IoMdWallet size={20} />
                                        </div>
                                        <p className="text-sm">
                                            Connect Wallet
                                        </p>
                                    </button>
                                );
                            }

                            if (chain.unsupported) {
                                return (
                                    <button
                                        onClick={openChainModal}
                                        type="button"
                                        className="flex justify-start items-center space-x-2 w-full rounded-xl bg-warningYellow p-4 md:p-2 text-white "
                                    >
                                        <div className="p-2 rounded-lg bg-white/10">
                                            <TbRefresh size={20} />
                                        </div>
                                        <p className="text-sm">
                                            Switch to Goerli
                                        </p>
                                    </button>
                                );
                            }

                            return (
                                <button
                                    onClick={openAccountModal}
                                    className="flex w-full items-center space-x-3 pl-4 pr-8 py-4 md:pl-2 md:pr-6 md:py-2 rounded-xl bg-aqueductBlue/5 hover:bg-aqueductBlue/10 dark:bg-gray-800/60 dark:hover:bg-gray-700/60 transition-all ease-in-out duration-300"
                                >
                                    <img
                                        src={makeBlockie(account.address)}
                                        className="w-8 h-8 rounded-lg"
                                    />
                                    <p className="text-gray-600 dark:text-white font-medium monospace-font">
                                        {account.address &&
                                            account.address.slice(0, 6) +
                                                "..." +
                                                account.address.slice(-4)}
                                    </p>
                                </button>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
};

export default CustomWalletConnectButton;

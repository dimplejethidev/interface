import { ConnectButton } from '@rainbow-me/rainbowkit';
import { IoMdWallet } from 'react-icons/io'
import { MdOutlineAccountBalanceWallet } from 'react-icons/md'
import makeBlockie from 'ethereum-blockies-base64';

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
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                        authenticationStatus === 'authenticated');

                return (
                    <div
                        {...(!ready && {
                            'aria-hidden': true,
                            'style': {
                                opacity: 0,
                                pointerEvents: 'none',
                                userSelect: 'none',
                            },
                        })}
                    >
                        {(() => {
                            if (!connected) {
                                return (
                                    <button onClick={openConnectModal} type="button" className='flex justify-start items-center space-x-2 w-full rounded-xl bg-aqueductBlue p-2 text-white '>
                                        <div className='p-2 rounded-lg bg-white/10'>
                                            <IoMdWallet size={20} />
                                        </div>
                                        <p className='text-sm'>
                                            Connect Wallet
                                        </p>
                                    </button>
                                );
                            }

                            if (chain.unsupported) {
                                return (
                                    <button onClick={openChainModal} type="button">
                                        Wrong network
                                    </button>
                                );
                            }

                            return (
                                <button 
                                    onClick={openAccountModal} 
                                    className='flex w-full items-center space-x-3 pl-2 pr-6 py-2 rounded-xl bg-aqueductBlue/5 hover:bg-aqueductBlue/10 transition-all ease-in-out duration-300'
                                >
                                    <img
                                        src={makeBlockie(account.address)}
                                        className='w-8 h-8 rounded-lg'
                                    />
                                    <p className='text-aqueductBlue2 text-gray-600 font-medium'>
                                        {account.address && (account.address.slice(0, 6) + "..." + account.address.slice(-4))}
                                    </p>
                                </button>
                            )

                            return (
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <button
                                        onClick={openChainModal}
                                        style={{ display: 'flex', alignItems: 'center' }}
                                        type="button"
                                    >
                                        {chain.hasIcon && (
                                            <div
                                                style={{
                                                    background: chain.iconBackground,
                                                    width: 12,
                                                    height: 12,
                                                    borderRadius: 999,
                                                    overflow: 'hidden',
                                                    marginRight: 4,
                                                }}
                                            >
                                                {chain.iconUrl && (
                                                    <img
                                                        alt={chain.name ?? 'Chain icon'}
                                                        src={chain.iconUrl}
                                                        style={{ width: 12, height: 12 }}
                                                    />
                                                )}
                                            </div>
                                        )}
                                        {chain.name}
                                    </button>

                                    <button onClick={openAccountModal} type="button">
                                        {account.displayName}
                                        {account.displayBalance
                                            ? ` (${account.displayBalance})`
                                            : ''}
                                    </button>
                                </div>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
};

export default CustomWalletConnectButton;
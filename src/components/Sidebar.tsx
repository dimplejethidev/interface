/* eslint-disable react/require-default-props */
import { TbArrowsRight, TbArrowsRightLeft, TbCirclePlus } from "react-icons/tb";
import { MdLightbulbOutline } from "react-icons/md";
import { AiOutlineLineChart } from "react-icons/ai";
import Head from "next/head";
import Image from "next/image";
import { IoClose, IoMenu } from "react-icons/io5";
import { FiMoon } from "react-icons/fi";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FaDollarSign } from "react-icons/fa";
import { useAccount, useNetwork, useProvider, useSigner } from "wagmi";
import { BigNumber, ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";

import { fDAIxp, fTokenDistributor, fUSDCxp } from "../utils/constants";
import LoadingSpinner from "./LoadingSpinner";
import { TutorialItemState, useTutorial } from "../utils/TutorialProvider";
import logo from "../../public/aq-logo-11-22.png";
import CustomWalletConnectButton from "./CustomWalletConnectButton";
import { useDarkMode } from "../utils/DarkModeProvider";
import SidebarOption from "./SidebarOption";
import { showTransactionConfirmedToast } from "./Toasts";
import getErrorToast from "../utils/getErrorToast";

const navItems: { icon: JSX.Element; label: string; page: string }[] = [
    {
        icon: <AiOutlineLineChart size={18} />,
        label: "My Streams",
        page: "/my-streams",
    },
    {
        icon: <TbArrowsRightLeft size={18} />,
        label: "Swap",
        page: "/",
    },
    {
        icon: <TbArrowsRight size={18} />,
        label: "Provide Liquidity",
        page: "/provide-liquidity",
    },
    {
        icon: <TbCirclePlus size={18} />,
        label: "Wrap / Unwrap",
        page: "/wrap",
    },
];

const Sidebar = ({
    isShown,
    setIsShown,
}: {
    isShown: boolean;
    setIsShown: Dispatch<SetStateAction<boolean>>;
}) => {
    const darkContext = useDarkMode();
    const { data: rainbowSigner } = useSigner();
    const signer = rainbowSigner as ethers.Signer;
    const { chain } = useNetwork();
    const provider = useProvider();

    useEffect(() => {
        if (localStorage.getItem("color-theme") === "light") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const [isDefinitelyConnected, setIsDefinitelyConnected] = useState(false);
    const { address, isConnected } = useAccount();
    const tutorialContext = useTutorial();
    const [isRequestingFunds, setIsRequestingFunds] = useState(false);

    useEffect(() => {
        if (isConnected) {
            setIsDefinitelyConnected(true);
        } else {
            setIsDefinitelyConnected(false);
        }
    }, [address, isConnected]);

    // only show request funds button if user isn't already receiving the stream
    const [showRequestFunds, setShowRequestFunds] = useState(false);
    useEffect(() => {
        async function checkFundFlow() {
            if (!address) {
                return;
            }

            const chainId = chain?.id;
            const sf = await Framework.create({
                chainId: Number(chainId),
                provider,
            });
            const flow0 = (
                await sf.cfaV1.getFlow({
                    superToken: fDAIxp,
                    sender: fTokenDistributor,
                    receiver: address,
                    providerOrSigner: provider,
                })
            ).flowRate;
            const flow1 = (
                await sf.cfaV1.getFlow({
                    superToken: fUSDCxp,
                    sender: fTokenDistributor,
                    receiver: address,
                    providerOrSigner: provider,
                })
            ).flowRate;

            setShowRequestFunds(
                BigNumber.from(flow0).eq(0) && BigNumber.from(flow1).eq(0)
            );
        }

        checkFundFlow();
    }, [address, tutorialContext?.requestedPay, chain?.id, provider]);

    const requestFunds = async () => {
        // give user funds
        const distributorABI = ["function requestTokens() external"];
        const distributorContract = new ethers.Contract(
            fTokenDistributor,
            distributorABI,
            signer
        );

        setIsRequestingFunds(true);
        let transactionHash;
        try {
            const result = await distributorContract.requestTokens();
            transactionHash = result.hash;
            const transactionReceipt = await result.wait();

            tutorialContext?.setRequestedPay(TutorialItemState.Complete);
            showTransactionConfirmedToast(
                "Tokens received",
                transactionReceipt.transactionHash
            );
        } catch (error) {
            getErrorToast(error, transactionHash);
        }
        setIsRequestingFunds(false);
    };

    const enableDarkMode = () => {
        document.documentElement.classList.add("dark");
        localStorage.setItem("color-theme", "light");
        darkContext?.setIsDark(true);
        document.body.style.background = "#000000";
    };
    const enableLightMode = () => {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("color-theme", "dark");
        darkContext?.setIsDark(false);
        document.body.style.background = "#ffffff";
    };

    return (
        <header className="flex flex-col p-4 w-full md:w-64 md:h-full space-y-8 bg-transparent border-r2 md:border-[1px] dark:md:border-2 dark:md:bg-gray-900/60 dark:md:border-gray-800/60 md:centered-shadow dark:md:centered-shadow-dark rounded-2xl dark:border-gray-800/60 flex-shrink-0 md:overflow-y-auto">
            <Head>
                <title>Aqueduct</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="flex items-center space-x-2 text-aqueductBlue">
                <Image
                    src={logo}
                    alt="Aqueduct logo"
                    width="45px"
                    height="45px"
                    className="rounded-xl opacity-95"
                />
                <div className="flex items-center h-full">
                    <h1 className="text-2xl font-semibold pl-1 poppins-font text-transparent bg-clip-text bg-gradient-to-br from-[#2B75CE] to-[#0C4791]">
                        aqueduct
                    </h1>
                </div>
                <div className="flex grow" />
                <button
                    type="button"
                    className="md:hidden"
                    onClick={() => {
                        setIsShown(!isShown);
                    }}
                >
                    {isShown ? <IoClose size={28} /> : <IoMenu size={28} />}
                </button>
            </div>
            <div
                className={`grow space-y-8 transition-all duration-500 ${
                    isShown
                        ? "flex flex-col w-full top-[64px] bottom-0 md:top-0 p-4 md:p-0 left-0 absolute md:relative z-50"
                        : "hidden md:flex md:flex-col"
                }`}
            >
                <div
                    className={
                        tutorialContext?.connectedWallet ===
                        TutorialItemState.ShowHint
                            ? "after:rounded-2xl relative after:pointer-events-none after:animate-border after:-m-1 after:border-2 after:border-aqueductBlue after:top-0 after:absolute after:bottom-0 after:left-0 after:right-0"
                            : ""
                    }
                >
                    <CustomWalletConnectButton />
                </div>
                <ul className="space-y-3 pb-8">
                    {navItems.map(({ icon, label, page }) => (
                        <SidebarOption
                            icon={icon}
                            label={label}
                            page={page}
                            setSidebarIsShown={setIsShown}
                            key={label}
                        />
                    ))}
                </ul>
                <div className="flex grow" />
                <div className="space-y-2">
                    <div className="flex grow" />
                    {isDefinitelyConnected && showRequestFunds && (
                        <div
                            className={
                                tutorialContext?.requestedPay ===
                                TutorialItemState.ShowHint
                                    ? "after:rounded-2xl relative after:pointer-events-none after:animate-border after:-m-1 after:border-2 after:border-aqueductBlue after:top-0 after:absolute after:bottom-0 after:left-0 after:right-0"
                                    : ""
                            }
                        >
                            <SidebarOption
                                icon={
                                    isRequestingFunds ? (
                                        <LoadingSpinner size={18} />
                                    ) : (
                                        <FaDollarSign size={18} />
                                    )
                                }
                                label="Request funds"
                                key="Request funds"
                                onClickFunction={() => requestFunds()}
                            />
                        </div>
                    )}
                    <div className="flex dark:hidden">
                        <SidebarOption
                            icon={<FiMoon size={18} />}
                            label="Dark mode"
                            key="Dark mode"
                            onClickFunction={() => enableDarkMode()}
                        />
                    </div>
                    <div className="hidden dark:flex">
                        <SidebarOption
                            icon={<MdLightbulbOutline size={18} />}
                            label="Light mode"
                            key="Light mode"
                            onClickFunction={() => enableLightMode()}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Sidebar;

import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import {
    getDefaultWallets,
    RainbowKitProvider,
    lightTheme,
    darkTheme,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../styles/globals.css";
import CustomAvatar from "../components/CustomAvatar";
import Sidebar from "../components/Sidebar";
import DarkModeProvider from "../utils/DarkModeProvider";
import TutorialChecklistPopup from "../components/TutorialChecklistPopup";

const { chains, provider } = configureChains(
    [chain.goerli],
    [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY ?? "" })]
);

const { connectors } = getDefaultWallets({
    appName: "Aqueduct",
    chains,
});

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
});

// This prevents an error when hydrating. As the component is dynamically rendered on the client side. The initial UI does not match what was rendered on the server.
const DynamicTutorialProvider = dynamic(
    () => import("../utils/TutorialProvider"),
    { ssr: false }
);

const MyApp = ({ Component, pageProps }: AppProps) => {
    const [isShown, setIsShown] = useState(false);
    const router = useRouter();

    // dark mode params
    const [isDark, setIsDark] = useState<boolean>(false);
    useEffect(() => {
        const dark = document.documentElement.classList.contains("dark");
        setIsDark(dark);

        if (dark) {
            document.body.style.background = "#000000";
        }
    }, [setIsDark]);

    // route to welcome message if first time user
    useEffect(() => {
        if (
            router.pathname.substring(0, 5) !== "/pair" &&
            !localStorage.getItem("hide-welcome-message")
        ) {
            router.push("/welcome");
            localStorage.setItem("hide-welcome-message", "true");
        }
    }, [router]);

    return (
        <div>
            {router.pathname === "/landing" ? (
                // eslint-disable-next-line react/jsx-props-no-spreading
                <Component {...pageProps} />
            ) : (
                <WagmiConfig client={wagmiClient}>
                    <DarkModeProvider isDark={isDark} setIsDark={setIsDark}>
                        <RainbowKitProvider
                            chains={chains}
                            theme={
                                isDark
                                    ? darkTheme({ accentColor: "#2662CB" })
                                    : lightTheme({ accentColor: "#2662CB" })
                            }
                            avatar={CustomAvatar}
                        >
                            <DynamicTutorialProvider>
                                <div className="w-full h-screen text-slate-500 poppins-font bg-white dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-blueBlack dark:to-black">
                                    <div className="flex flex-col md:flex-row h-full items-center md:items-stretch">
                                        <div className="w-full md:w-auto md:p-4">
                                            <Sidebar
                                                isShown={isShown}
                                                setIsShown={setIsShown}
                                            />
                                        </div>
                                        <main
                                            className={`flex flex-col items-center space-y-4 md:space-y-16 px-4 w-full overflow-y-scroll ${
                                                isShown && " hidden md:flex "
                                            }`}
                                        >
                                            <div className="md:h-[50%]" />
                                            <Component
                                                // eslint-disable-next-line react/jsx-props-no-spreading
                                                {...pageProps}
                                            />
                                            <div className="md:h-[50%]" />
                                            <ToastContainer
                                                toastClassName="relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"
                                                bodyClassName={() =>
                                                    "text-lg font-white font-med block p-4"
                                                }
                                                position="bottom-right"
                                                autoClose={5000}
                                            />
                                        </main>
                                    </div>
                                    <TutorialChecklistPopup />
                                </div>
                            </DynamicTutorialProvider>
                        </RainbowKitProvider>
                    </DarkModeProvider>
                </WagmiConfig>
            )}
        </div>
    );
};

export default MyApp;

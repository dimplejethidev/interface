/* eslint-disable react/no-array-index-key */
import type { NextPage } from "next";
import { useState } from "react";
import { IoCheckmark, IoChevronForwardOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import { TiWaves } from "react-icons/ti";
import { GiTwoCoins } from "react-icons/gi";
import { IoIosWallet } from "react-icons/io";
import { TbArrowsRightLeft } from "react-icons/tb";
import { VscGraphLine } from "react-icons/vsc";
import { AiOutlineQuestionCircle } from "react-icons/ai";

import WidgetContainer from "../components/widgets/WidgetContainer";

interface SlideItem {
    title: string;
    text: string;
    icon?: JSX.Element;
}

const ICON_SIZE = 150;
const slideItems: SlideItem[] = [
    {
        title: "Welcome to aqueduct!",
        text: "Aqueduct is the trading protocol for real-time finance - swap tokens continuously, on a per second basis.",
        icon: <TiWaves size={ICON_SIZE + 35} />,
    },
    {
        title: "1. Connect your wallet",
        text: "Click the button in the top-left corner to connect your wallet.",
        icon: <IoIosWallet size={ICON_SIZE} />,
    },
    {
        title: "2. Request some tokens",
        text: "You'll need some super tokens. Conveniently, we'll \"pay\" you via a continuous Superfluid stream.",
        icon: <GiTwoCoins size={ICON_SIZE} />,
    },
    {
        title: "3. Start a swap",
        text: "Simply start a swap by selecting a token and specifying a flow rate. Every second, you'll be sending some tokens and receiving the swapped tokens.",
        icon: <TbArrowsRightLeft size={ICON_SIZE - 15} />,
    },
    {
        title: "4. Watch your balances",
        text: 'The "My Streams" tab will show your positions. You can click a position to show the amounts of each token that have been streamed.',
        icon: <VscGraphLine size={ICON_SIZE - 15} />,
    },
    {
        title: "Need more help?",
        text: 'Click the button in the bottom-right corner to see your progress in this tutorial. Click one of the "?" icons to get help for that step.',
        icon: <AiOutlineQuestionCircle size={ICON_SIZE} />,
    },
];

const Slide = ({ slideItem }: { slideItem: SlideItem }) => (
    <div className="space-y-2">
        <div className="flex items-center justify-center pt-6 pb-14 text-aqueductBlue glow-blue-xs z-50">
            {slideItem.icon}
        </div>
        <p
            className="text-black dark:text-white text-2xl font-semibold leading-relaxed"
            data-testid={`welcome-tutorial-section-${slideItem.title}`}
        >
            {slideItem.title}
        </p>
        <p className="leading-relaxed">{slideItem.text}</p>
    </div>
);

const Welcome: NextPage = () => {
    const [slideIndex, setSlideIndex] = useState(0);
    const router = useRouter();

    return (
        <div className="w-full flex items-center justify-center">
            <WidgetContainer isUnbounded={false}>
                <div className="space-y-6 px-3 md:px-0">
                    <div className="overflow-hidden">
                        {slideItems.map((e, i) => (
                            <div
                                className={`transition-all ${
                                    // eslint-disable-next-line no-nested-ternary
                                    i < slideIndex
                                        ? "duration-300 -translate-x-4 opacity-0 h-0 "
                                        : i > slideIndex
                                        ? " translate-x-8 opacity-0 h-0 overflow-hidden "
                                        : " duration-1000 "
                                }`}
                                key={i}
                            >
                                <Slide slideItem={e} />
                            </div>
                        ))}
                    </div>

                    <div className="flex items-end space-x-2">
                        {slideItems.map((e, i) => (
                            <div
                                className={`transition-all duration-1000 w-6 md:w-12 h-2 rounded-full ${
                                    i <= slideIndex
                                        ? " bg-aqueductBlue/70 "
                                        : " bg-aqueductBlue/20 "
                                }`}
                                key={i}
                            />
                        ))}
                        <div className="flex grow" />
                        <button
                            type="button"
                            className="px-6 py-3 bg-aqueductBlue/90 rounded-xl text-white"
                            onClick={() => {
                                if (slideIndex >= slideItems.length - 1) {
                                    // reroute to swap page when done
                                    router.push("/");
                                } else {
                                    setSlideIndex((i) => i + 1);
                                }
                            }}
                            aria-label="welcome-tutorial-next-button"
                        >
                            {slideIndex >= slideItems.length - 1 ? (
                                <IoCheckmark size={24} />
                            ) : (
                                <IoChevronForwardOutline size={24} />
                            )}
                        </button>
                    </div>
                </div>
            </WidgetContainer>
        </div>
    );
};

export default Welcome;

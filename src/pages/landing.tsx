import type { NextPage } from "next";
import Image from "next/image";
import { IoClose, IoDocument, IoLogoGithub, IoMenu } from "react-icons/io5";
import { ReactNode, useEffect, useState, useRef } from "react";
import { animated } from "react-spring";
import calculatePathSmooth, {
    mapDataToSvgCoordinates,
} from "../utils/smooth-path";
import ethPriceData from "../data/ethPriceData.json";

const ANIMATION_MINIMUM_STEP_TIME = 10;

const NavLink = ({
    icon,
    title,
    link,
}: {
    icon: ReactNode;
    title: string;
    link: string;
}) => (
    <a target="_blank" href={link} rel="noopener noreferrer">
        <div className="flex space-x-2 items-center bg-aqueductBlue/10 px-5 py-2 rounded-xl">
            {icon}
            <p>{title}</p>
        </div>
    </a>
);

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className={`fixed top-0 flex w-full text-aqueductBlue p-4 lg:px-8 lg:pt-6 lg:pb-4 z-50 backdrop-blur-3xl ${
                isOpen ? "flex-col lg:flex-row" : "flex-row"
            }`}
        >
            <div className="flex w-full items-end space-x-2 lg:space-x-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="aqueduct-logo-transparent.png"
                    alt="Aqueduct logo"
                    className="w-10 h-10 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl"
                />
                <h1 className="text-2xl lg:text-3xl font-semibold pr-2 lg:pr-3 poppins-font">
                    aqueduct
                </h1>
                <div className="flex grow" />
                <button
                    type="button"
                    className="md:hidden mb-[3px]"
                    onClick={() => {
                        setIsOpen(!isOpen);
                    }}
                >
                    {isOpen ? <IoClose size={28} /> : <IoMenu size={28} />}
                </button>
            </div>
            <div
                className={`${
                    isOpen ? "flex flex-col space-y-4 pt-4" : "hidden"
                } md:flex md:flex-row md:space-y-0 md:pt-0 md:space-x-3`}
            >
                <NavLink
                    icon={<IoDocument size={25} />}
                    title="Docs"
                    link="https://josh-kokatnur.gitbook.io/aqueduct-finance/overview/pools"
                />
                <NavLink
                    icon={<IoLogoGithub size={25} />}
                    title="Code"
                    link="https://github.com/aqueduct-finance"
                />
                <a target="_blank" href="/" rel="noopener noreferrer">
                    <div className="flex space-x-2 items-center bg-aqueductBlue font-semibold text-white px-5 py-2 rounded-xl">
                        <p className="whitespace-nowrap">Launch App</p>
                    </div>
                </a>
            </div>
        </div>
    );
};

const BalancesDisplay = () => {
    // REFRESH(in milliseconds) = REFRESH_INTERVAL * ANIMATION_MINIMUM_STEP_TIME
    const [time, setTime] = useState(0);
    const [outgoingBalance, setOutgoingBalance] = useState(998);
    const [incomingBalance, setIncomingBalance] = useState(112);
    useEffect(() => {
        const timer = setTimeout(() => {
            setTime(time + 1);

            // animate frame
            setOutgoingBalance((b) => b - 0.1231 * 0.05);
            setIncomingBalance((b) => b + 0.0123 * 0.05);
        }, ANIMATION_MINIMUM_STEP_TIME);
        return () => {
            clearTimeout(timer);
        };
    }, [time]);

    return (
        <div
            className="flex flex-col-reverse w-full md:w-2/3 md:flex-row p-4 md:p-0 justify-center"
            style={{ perspective: "80rem" }}
        >
            <div className="flex flex-col justify-center space-y-4 lg:space-y-8 lg:rotate-y-md">
                <div className="flex items-center justify-center space-x-8 text-daiYellow bg-daiYellow/10 py-8 px-12 rounded-3xl glow-yellow-xs">
                    {/* <AnimatedBalance
                        value={outgoingBalance.toFixed(4)}
                        isIncreasing={false}
                    /> */}
                    <p className="monospace-font text-4xl md:text-6xl tracking-widest font-bold">
                        {outgoingBalance.toFixed(4)}
                    </p>
                    <Image
                        src="dai-logo.png"
                        className="w-12 h-12"
                        // layout="fill"
                    />
                </div>
                <div className="flex items-center justify-center space-x-8 text-ethPink bg-ethPink/10 py-8 px-12 rounded-3xl glow-pink-xs">
                    {/* <AnimatedBalance
                        value={incomingBalance.toFixed(4)}
                        isIncreasing={true}
                    /> */}
                    <p className="monospace-font text-4xl md:text-6xl tracking-widest font-bold">
                        {incomingBalance.toFixed(4)}
                    </p>
                    <Image
                        src="eth-logo-color.png"
                        className="bg-ethPink rounded-full"
                        width="48"
                        height="48"
                    />
                </div>
            </div>
            <div
                className="flex items-center justify-center text-white font-bold text-3xl bg-white/5 p-16 mb-4 lg:mb-0 rounded-3xl lg:-rotate-y-md"
                style={{ perspective: "60rem" }}
            >
                <p className="lg:-rotate-y-sm">
                    Watch your balances
                    <br /> change every second.
                </p>
            </div>
        </div>
    );
};

const DcaDisplay = () => {
    const convertedPoint = mapDataToSvgCoordinates(ethPriceData);
    const points = calculatePathSmooth(convertedPoint);

    const dummyRef = useRef<SVGPathElement>(null);
    const [pathLength, setPathLength] = useState<number>(0);
    useEffect(() => {
        // get the length of the svg path
        if (dummyRef?.current) {
            setPathLength(dummyRef.current.getTotalLength());
        }
        // api.start({ strokeDashoffset: 0 })
    }, [points]);

    // const [styles, api] = useSpring(() => ({ strokeDashoffset: 20750 }))

    return (
        <div
            className="flex flex-col w-full p-4 space-y-4 md:p-0 md:space-y-0 md:w-2/3 md:flex-row "
            style={{ perspective: "80rem" }}
        >
            <div
                className="flex items-center justify-center text-white font-bold text-3xl bg-aqueductBlue p-16 rounded-3xl lg:rotate-y-md"
                style={{ perspective: "60rem" }}
            >
                <p className="lg:rotate-y-sm">
                    Avoid the chaos, <br /> dollar cost average.
                </p>
            </div>
            <div
                className="bg-aqueductBlue/10 md:w-2/3 rounded-3xl p-16 pr-20 lg:-rotate-y-md"
                style={{ perspective: "60rem" }}
            >
                <svg
                    className="w-full h-full lg:-rotate-y-sm"
                    viewBox="0 0 7000 4600"
                >
                    <path
                        ref={dummyRef}
                        d={points}
                        stroke="blue"
                        fill="none"
                        strokeWidth="00"
                    />
                    {/* { TODO:  fix typescript and linting error  } */}
                    <animated.path
                        fill="none"
                        strokeWidth="75"
                        strokeDasharray={pathLength}
                        d={points}
                        className="stroke-aqueductBlue/20 will-change-transform "
                        // style={{ willChange: 'stroke-dashoffset', transform: 'translate3d(0, 0, 0)' }}
                        // style={styles}
                    />
                    <path
                        d="M 0 4500 L 7000 2000"
                        className="stroke-aqueductBlue"
                        fill="none"
                        strokeWidth="75"
                    />
                </svg>
            </div>
        </div>
    );
};

const Landing: NextPage = () => (
    <div className="flex flex-col w-full items-center space-y-0 text-slate-500 poppins-font">
        <NavBar />
        <div
            className={
                /* "flex items-center justify-center h-[40rem] md:h-[48rem] lg:h-[56rem] xl:h-[62rem] 2xl:h-[70rem] 3xl:[78rem] w-full sm:w-auto sm:aspect-square flex-shrink-0 px-32"
                    + " lg:-translate-y-8 xl:-translate-y-20 2xl:-translate-y-36" */
                "flex items-center justify-center h-screen w-full lg:w-2/3 px-16 md:px-0 max-w-[80rem]"
            }
            style={{
                background: "url(/background.gif) no-repeat center transparent",
                backgroundSize: "cover",
            }}
        >
            <p className="text-white font-bold text-6xl z-40">
                swap tokens <br /> in real time.
            </p>
        </div>
        <div className="h-16 w-full bg-blueBlack2" />
        <div className="flex h-screen items-center justify-center w-full bg-blueBlack2">
            <BalancesDisplay />
        </div>
        <div className="h-16 w-full bg-blueBlack2" />
        <div className="flex h-screen items-center justify-center w-full bg-white">
            <DcaDisplay />
        </div>
    </div>
);

export default Landing;

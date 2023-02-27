import { useState } from "react";
import { IoChevronDownOutline } from "react-icons/io5";
import { TutorialItemState, useTutorial } from "../utils/TutorialProvider";
import TutorialChecklistItem from "./TutorialChecklistItem";

const TutorialChecklistPopup = () => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const tutorialContext = useTutorial();
    const doNothing = () => {};

    return (
        <div className="p-4 fixed md:right-6 md:bottom-6 rounded-2xl bg-white dark:border-2 dark:border-gray-800/60 dark:bg-gray-900/60 centered-shadow dark:centered-shadow-dark">
            <div className="transition-all duration-300 overflow-hidden flex">
                <div
                    className={`transition-all duration-300 ${
                        isCollapsed
                            ? " max-w-0 opacity-0 "
                            : " max-w-xs opacity-100 "
                    }`}
                >
                    Tutorial
                </div>
                <div className="flex grow" />
                <button
                    type="button"
                    className={`transition-all duration-500 ${
                        isCollapsed ? " rotate-180 " : " rotate-0 "
                    }`}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    <IoChevronDownOutline size={18} />
                </button>
            </div>
            <div
                className={`transition-all duration-500 overflow-hidden space-y-4 ${
                    isCollapsed
                        ? " max-h-0 max-w-0 "
                        : " max-h-64 max-w-xs pt-4 "
                }`}
            >
                <TutorialChecklistItem
                    text="Connect wallet"
                    itemState={
                        tutorialContext?.connectedWallet ??
                        TutorialItemState.Incomplete
                    }
                    setItemState={
                        tutorialContext?.setConnectedWallet ?? doNothing
                    }
                />
                <TutorialChecklistItem
                    text="Request funds"
                    itemState={
                        tutorialContext?.requestedPay ??
                        TutorialItemState.Incomplete
                    }
                    setItemState={tutorialContext?.setRequestedPay ?? doNothing}
                />
                <TutorialChecklistItem
                    text="Start a swap"
                    itemState={
                        tutorialContext?.startedSwap ??
                        TutorialItemState.Incomplete
                    }
                    setItemState={tutorialContext?.setStartedSwap ?? doNothing}
                />
            </div>
        </div>
    );
};

export default TutorialChecklistPopup;

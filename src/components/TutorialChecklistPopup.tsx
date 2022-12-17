import { useState } from "react";
import { AiOutlineQuestionCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";
import { IoChevronDownOutline } from "react-icons/io5";
import { TutorialItemState, useTutorial } from "../utils/TutorialProvider";

interface ChecklistItemProps {
    text: string;
    itemState: TutorialItemState;
    setItemState: (state: TutorialItemState) => void;
}

const ChecklistItem = ({ text, itemState, setItemState }: ChecklistItemProps) => {
    return (
        <div className="flex items-center space-x-3">
            <div
                className={`flex items-center justify-center text-white border-[2px] rounded-md w-5 h-5 transition-all duration-500 
                    ${itemState === TutorialItemState.Complete
                        ? "border-aqueductBlue bg-aqueductBlue"
                        : "border-gray-300 dark:border-gray-700"
                    }`
                }
            >
                {itemState === TutorialItemState.Complete && <BsCheckLg size={8} />}
            </div>
            <div>
                {text}
            </div>
            <div className="flex grow w-8" />
            {
                itemState !== TutorialItemState.Complete &&
                <button
                    type="button"
                    onClick={() => {
                        if (setItemState) {
                            itemState === TutorialItemState.ShowHint ?
                                setItemState(TutorialItemState.Incomplete)
                                :
                                setItemState(TutorialItemState.ShowHint)
                        }
                    }}
                    className='transition-all duration-300 hover:scale-105'
                >
                    {
                        itemState === TutorialItemState.ShowHint
                            ?
                            <AiOutlineCloseCircle size={20} />
                            :
                            <AiOutlineQuestionCircle size={20} />
                    }
                </button>
            }
        </div>
    )
}

const TutorialChecklistPopup = () => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const tutorialContext = useTutorial();
    const doNothing = () => { }

    return (
        <div
            className="p-4 fixed md:right-6 md:bottom-6 rounded-2xl bg-white dark:border-2 dark:border-gray-800/60 dark:bg-gray-900/60 centered-shadow dark:centered-shadow-dark"
        >
            <div className='transition-all duration-300 overflow-hidden flex'>
                <div className={`transition-all duration-300 ${isCollapsed ? " max-w-0 opacity-0 " : " max-w-xs opacity-100 "}`} >
                    Tutorial
                </div>
                <div className='flex grow' />
                <button
                    className={`transition-all duration-500 ${isCollapsed ? " rotate-180 " : " rotate-0 "}`}
                    onClick={() => {
                        setIsCollapsed(!isCollapsed);
                    }}
                >
                    <IoChevronDownOutline size={18} />
                </button>
            </div>
            <div className={`transition-all duration-500 overflow-hidden space-y-4 ${isCollapsed ? ' max-h-0 max-w-0 ' : ' max-h-64 max-w-xs pt-4 '}`}>
                <ChecklistItem
                    text='Connect wallet'
                    itemState={tutorialContext?.connectedWallet ?? TutorialItemState.Incomplete}
                    setItemState={tutorialContext?.setConnectedWallet ?? doNothing}
                />
                <ChecklistItem
                    text='Request funds'
                    itemState={tutorialContext?.requestedPay ?? TutorialItemState.Incomplete}
                    setItemState={tutorialContext?.setRequestedPay ?? doNothing}
                />
                <ChecklistItem
                    text='Start a swap'
                    itemState={tutorialContext?.startedSwap ?? TutorialItemState.Incomplete}
                    setItemState={tutorialContext?.setStartedSwap ?? doNothing}
                />
            </div>
        </div >
    )
}

export default TutorialChecklistPopup;
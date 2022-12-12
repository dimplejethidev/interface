import { Dispatch, SetStateAction, useState } from "react";
import { BsCheckLg } from "react-icons/bs";
import { IoChevronDownOutline } from "react-icons/io5";

interface ChecklistItemProps {
    text: string;
    isChecked: boolean;
    setIsChecked: Dispatch<SetStateAction<boolean>>;
}

const ChecklistItem = ({ text, isChecked, setIsChecked }: ChecklistItemProps) => {
    return (
        <div className="flex items-center space-x-3 pr-2">
            <button
                type="button"
                className={`flex items-center justify-center text-white border-[2px] rounded-md w-5 h-5 transition-all duration-500 
                    ${isChecked
                        ? "border-aqueductBlue bg-aqueductBlue"
                        : "border-gray-300 dark:border-gray-700"
                    }`
                }
                onClick={() => {
                    setIsChecked(!isChecked);
                }}
            >
                {isChecked && <BsCheckLg size={8} />}
            </button>
            <div>
                {text}
            </div>
        </div>
    )
}

const TutorialChecklistPopup = () => {
    const [isChecked0, setIsChecked0] = useState(false);
    const [isChecked1, setIsChecked1] = useState(false);
    const [isChecked2, setIsChecked2] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(true);

    return (
        <div
            className="space-y- p-4 min-w-[12rem] fixed right-6 bottom-6 rounded-2xl md:bg-white dark:md:border-2 dark:md:border-gray-800/60 dark:md:bg-gray-900/60 md:centered-shadow dark:md:centered-shadow-dark"
        >
            <div className="flex">
                <div>
                    Checklist
                </div>
                <div className="flex grow" />
                <button
                    className={'transition-all duration-500 ' + (isCollapsed ? " rotate-180 " : " rotate-0 ")}
                    onClick={() => {
                        setIsCollapsed(!isCollapsed);
                    }}
                >
                    <IoChevronDownOutline size={18} />
                </button>
            </div>
            <div className={'transition-all duration-300 overflow-hidden space-y-4 ' + (isCollapsed ? ' max-h-0 ' : ' max-h-64 pt-4 ')}>
                <ChecklistItem
                    text='Connect wallet'
                    isChecked={isChecked0}
                    setIsChecked={setIsChecked0}
                />
                <ChecklistItem
                    text='Request pay'
                    isChecked={isChecked1}
                    setIsChecked={setIsChecked1}
                />
                <ChecklistItem
                    text='Start a swap'
                    isChecked={isChecked2}
                    setIsChecked={setIsChecked2}
                />
            </div>
        </div >
    )
}

export default TutorialChecklistPopup;
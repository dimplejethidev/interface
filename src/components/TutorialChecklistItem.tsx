import { AiOutlineQuestionCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";
import { TutorialItemState } from "../utils/TutorialProvider";

interface ChecklistItemProps {
    text: string;
    itemState: TutorialItemState;
    setItemState: (state: TutorialItemState) => void;
}

const TutorialChecklistItem = ({
    text,
    itemState,
    setItemState,
}: ChecklistItemProps) => {
    const showHint = () => {
        if (!setItemState) {
            return;
        }
        if (itemState === TutorialItemState.ShowHint) {
            setItemState(TutorialItemState.Incomplete);
        } else {
            setItemState(TutorialItemState.ShowHint);
        }
    };

    return (
        <div className="flex items-center space-x-3">
            <div
                className={`flex items-center justify-center text-white border-[2px] rounded-md w-5 h-5 transition-all duration-500 
                    ${
                        itemState === TutorialItemState.Complete
                            ? "border-aqueductBlue bg-aqueductBlue"
                            : "border-gray-300 dark:border-gray-700"
                    }`}
            >
                {itemState === TutorialItemState.Complete && (
                    <BsCheckLg size={8} />
                )}
            </div>
            <div>{text}</div>
            <div className="flex grow w-8" />
            {itemState !== TutorialItemState.Complete && (
                <button
                    type="button"
                    onClick={() => showHint()}
                    className="transition-all duration-300 hover:scale-105"
                >
                    {itemState === TutorialItemState.ShowHint ? (
                        <AiOutlineCloseCircle size={20} />
                    ) : (
                        <AiOutlineQuestionCircle size={20} />
                    )}
                </button>
            )}
        </div>
    );
};

export default TutorialChecklistItem;

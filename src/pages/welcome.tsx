import WidgetContainer from "../components/widgets/WidgetContainer";
import type { NextPage } from "next";
import ToastType from "../types/ToastType";

interface WelcomeProps {
    showToast: (type: ToastType) => {};
}

const Welcome: NextPage<WelcomeProps> = ({ showToast }) => {
    return (
        <div className="w-full max-w-5xl">
            <WidgetContainer isUnbounded={true}>
                <div className="flex space-x-2 text-3xl font-bold">
                    <p className="">
                        Welcome to
                    </p>
                    <p className="text-aqueductBlue">
                        aqueduct
                    </p>
                    <p className="">
                        !
                    </p>
                </div>
            </WidgetContainer>
        </div>
    );
};

export default Welcome;
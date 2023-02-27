/* eslint-disable react/require-default-props */
import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";

interface SideBarTabProps {
    icon: JSX.Element;
    label: string;
    page?: string;
    setSidebarIsShown?: Dispatch<SetStateAction<boolean>>;
    onClickFunction?: () => void;
}

const SidebarOption = ({
    icon,
    label,
    page,
    setSidebarIsShown,
    onClickFunction,
}: SideBarTabProps) => {
    const router = useRouter();

    const handleSidebarClickOption = async () => {
        if (page) {
            router.push(page);
        } else if (onClickFunction) {
            onClickFunction();
        }

        if (setSidebarIsShown) {
            // eslint-disable-next-line no-promise-executor-return
            await new Promise((resolve) => setTimeout(resolve, 100));
            setSidebarIsShown(false);
        }
    };

    return (
        <button
            type="button"
            className={`flex w-full items-center space-x-3 pl-4 pr-8 py-4 md:pl-2 md:pr-6 md:py-2 rounded-xl transition-all ease-in-out duration-300
                        ${
                            router.asPath === page
                                ? "bg-aqueductBlue/5 dark:bg-aqueductBlue/20 hover:bg-aqueductBlue/10"
                                : "hover:bg-gray-100 dark:hover:bg-gray-800/60"
                        } `}
            onClick={() => handleSidebarClickOption()}
            aria-label={`${label} page link`}
        >
            <div
                className={`bg-gray-100 p-2 rounded-lg ${
                    router.asPath === page
                        ? "bg-aqueductBlue/10 text-aqueductBlue dark:bg-transparent"
                        : "text-gray-400 dark:bg-gray-800/60 dark:text-white"
                }`}
            >
                {icon}
            </div>
            <p
                className={`text-sm font-medium ${
                    router.asPath === page
                        ? "bg-transparent text-aqueductBlue"
                        : "text-gray-600 dark:text-white"
                }`}
            >
                {label}
            </p>
        </button>
    );
};

export default SidebarOption;

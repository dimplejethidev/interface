/* eslint-disable react/require-default-props */
type ButtonProps = {
    title: string;
    action: () => void;
    isSelected: boolean;
};

interface WidgetContainerProps {
    title?: string;
    smallTitle?: string;
    buttons?: ButtonProps[];
    children: React.ReactNode;
    isUnbounded?: boolean;
}

const WidgetContainer = ({
    title,
    smallTitle,
    buttons,
    children,
    isUnbounded,
}: WidgetContainerProps) => (
    <div
        className={`flex flex-col w-full md:p-8 space-y-6 rounded-3xl md:bg-white dark:md:border-2 dark:md:border-gray-800/60 dark:md:bg-gray-900/60 md:centered-shadow dark:md:centered-shadow-dark transition ${
            !isUnbounded && "  max-w-xl "
        }`}
    >
        {(title || smallTitle || buttons) && (
            <div className="flex font-semibold space-x-4 text-lg whitespace-nowrap">
                {title && (
                    <div className="px-4 py-2 rounded-xl bg-aqueductBlue/10 w-min text-aqueductBlue">
                        {title}
                    </div>
                )}
                {buttons &&
                    buttons.map((button) => (
                        <button
                            type="button"
                            onClick={button.action}
                            className={`px-4 py-2 rounded-xl w-min transition-all ${
                                button.isSelected
                                    ? "bg-aqueductBlue/10 text-aqueductBlue"
                                    : "bg-gray-500/10 text-gray-500/60 opacity-50 hover:opacity-100"
                            }`}
                            key={button.title}
                        >
                            {button.title}
                        </button>
                    ))}
                {!title && !buttons && (
                    <div className="px-4 py-2 rounded-xl text-sm bg-gray-100 dark:bg-gray-700/60 w-min text-gray-400 dark:text-white/80">
                        {smallTitle}
                    </div>
                )}
            </div>
        )}
        {children}
    </div>
);

export default WidgetContainer;

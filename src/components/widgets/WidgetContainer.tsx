type ButtonProps = {
    title: string;
    action: () => void;
    isSelected: boolean;
}

interface WidgetContainerProps {
    title?: string;
    smallTitle?: string;
    buttons?: ButtonProps[];
    children: React.ReactNode;
    isUnbounded?: boolean;
}

const WidgetContainer = ({ title, smallTitle, buttons, children, isUnbounded }: WidgetContainerProps) => {
    return (
        <div
            className={
                "flex flex-col w-full md:p-8 space-y-6 rounded-3xl bg-white dark:bg-transparent dark:md:bg-zinc-800/80 md:centered-shadow dark:centered-shadow-dark transition "
                + (!isUnbounded && '  max-w-lg ')
            }
        >
            {
                (title || smallTitle || buttons) &&
                <div className="flex font-semibold space-x-4 text-lg whitespace-nowrap">
                    {
                        title
                            ?
                            <div className='px-4 py-2 rounded-xl bg-aqueductBlue/10 w-min text-aqueductBlue'>
                                {title}
                            </div>
                            :
                            (
                                buttons 
                                ?
                                buttons.map((b) => {
                                    return (
                                        <button
                                            onClick={b.action}
                                            className={
                                                'px-4 py-2 rounded-xl w-min transition-all '
                                                + (b.isSelected ? 'bg-aqueductBlue/10 text-aqueductBlue' : 'bg-gray-500/10 text-gray-500/60 opacity-50 hover:opacity-100')
                                            }
                                            key={b.title}
                                        >
                                            {b.title}
                                        </button>
                                    )
                                })
                                :
                                <div className='px-4 py-2 rounded-xl text-sm bg-gray-100 w-min text-gray-400'>
                                    {smallTitle}
                                </div>
                            )
                    }
                </div>
            }
            {children}
        </div>
    );
};

export default WidgetContainer;

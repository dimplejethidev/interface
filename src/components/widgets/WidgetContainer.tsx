type ButtonProps = {
    title: string;
    action: () => void;
    isSelected: boolean;
}

interface WidgetContainerProps {
    title?: string;
    buttons?: ButtonProps[];
    children: React.ReactNode;
}

const WidgetContainer = ({ title, buttons, children }: WidgetContainerProps) => {
    return (
        <div className="flex flex-col w-full max-w-lg md:p-8 space-y-6 rounded-3xl bg-white md:centered-shadow transition">
            <div className="flex font-semibold space-x-4 text-lg whitespace-nowrap">
                {
                    title
                        ?
                        <div className='px-4 py-2 rounded-xl bg-aqueductBlue/10 w-min text-aqueductBlue'>
                            {title}
                        </div>
                        :
                        (
                            buttons &&
                            buttons.map((b) => {
                                return (
                                    <button 
                                        onClick={b.action} 
                                        className={
                                            'px-4 py-2 rounded-xl w-min transition-all ' 
                                            + (b.isSelected ? 'bg-aqueductBlue/10 text-aqueductBlue' : 'bg-gray-500/10 text-gray-500/60 opacity-50 hover:opacity-100')
                                        }
                                    >
                                        {b.title}
                                    </button>
                                )
                            })
                        )
                }
            </div>
            {children}
        </div>
    );
};

export default WidgetContainer;

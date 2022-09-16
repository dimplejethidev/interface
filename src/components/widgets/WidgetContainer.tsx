interface WidgetContainerProps {
    title: string;
    children: React.ReactNode;
}

const WidgetContainer = ({ title, children }: WidgetContainerProps) => {
    return (
        <div className="flex flex-col w-full max-w-lg md:p-8 space-y-6 rounded-3xl bg-white md:centered-shadow">
            <div className="flex font-semibold px-4 py-2 rounded-xl text-lg whitespace-nowrap text-aqueductBlue bg-aqueductBlue/10 w-min">
                {title}
            </div>
            {children}
        </div>
    );
};

export default WidgetContainer;

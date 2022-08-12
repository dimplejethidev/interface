interface WidgetContainerProps {
    title: string;
    children: React.ReactNode;
}

const WidgetContainer = ({ title, children }: WidgetContainerProps) => {
    return (
        <div className="flex flex-col w-full max-w-lg pt-4 pb-2 px-2 space-y-2 rounded-3xl bg-white">
            <div className="flex font-bold pb-2 pl-3">{title}</div>
            {children}
        </div>
    );
};

export default WidgetContainer;

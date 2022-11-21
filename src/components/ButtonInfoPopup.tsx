interface ButtonWithInfoPopupParams {
    message: string;
    button: JSX.Element;
}

const ButtonWithInfoPopup = ({ message, button }: ButtonWithInfoPopupParams) => {
    return (
        <div className="group flex justify-center">
            <div className="absolute -translate-y-9 text-xs bg-white dark:bg-gray-800/60 border-[1px] dark:border-gray-800/60 px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 delay-300">
                {message}
            </div>
            {button}
        </div>
    )
}

export default ButtonWithInfoPopup;
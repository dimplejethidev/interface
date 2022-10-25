interface ButtonWithInfoPopupParams {
    message: string;
    button: JSX.Element;
}

const ButtonWithInfoPopup = ({ message, button }: ButtonWithInfoPopupParams) => {
    return (
        <div className="group flex justify-center">
            <div className="absolute -translate-y-9 text-xs bg-white border-[1px] px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 delay-300">
                {message}
            </div>
            {button}
        </div>
    )
}

export default ButtonWithInfoPopup;
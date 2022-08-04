import { useCallback, useEffect } from "react";
import { Toast } from "../types/Toast";

interface ToastMessageProps {
    toastList: Toast[];
    position: string;
    setList: (toast: Toast[]) => void;
}

const ToastMessage = ({ toastList, position, setList }: ToastMessageProps) => {
    const deleteToast = useCallback(
        (id: number) => {
            const toastListItems = toastList.filter((e) => e.id !== id);
            setList(toastListItems);
        },
        [toastList, setList]
    );

    useEffect(() => {
        const interval = setInterval(() => {
            if (toastList.length) {
                deleteToast(toastList[0].id);
            }
        }, 5000);

        return () => {
            clearInterval(interval);
        };
    }, [toastList, deleteToast]);

    // TODO: add styles to toast message
    return (
        <div>
            {toastList.map((toast, index) => (
                <div
                    key={index}
                    className="toast-notification"
                    style={{ backgroundColor: toast.backgroundColor }}
                >
                    <button onClick={() => deleteToast(toast.id)}>X</button>
                    <div>
                        <p>{toast.title}</p>
                        <p>{toast.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ToastMessage;

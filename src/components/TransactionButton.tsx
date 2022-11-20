import LoadingSpinner from "./LoadingSpinner";

interface TransactionButtonProps {
    title: string;
    loading: boolean;
    onClickFunction: () => void;
    errorMessage?: string;
}

const TransactionButton = ({ title, loading, onClickFunction, errorMessage }: TransactionButtonProps) => {
    return (
        <button
            className={
                "flex justify-center items-center h-14 font-bold rounded-2xl outline-2 transition-all duration-500 "
                + (errorMessage ? ' border-aqueductBlue/20 dark:border-aqueductBlue/50 border-2 text-aqueductBlue/50 dark:text-aqueductBlue/90 ' : ' bg-aqueductBlue/90 text-white ')
                + (!errorMessage && !loading && ' hover:outline2 ')
            }
            onClick={onClickFunction}
            disabled={loading || errorMessage != undefined}
        >
            {
                loading ?
                    <LoadingSpinner size={30} />
                    :
                    <p>
                        {errorMessage ? errorMessage : title}
                    </p>
            }
        </button>
    );
};

export default TransactionButton;

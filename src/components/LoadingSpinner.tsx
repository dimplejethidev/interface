import { AiOutlineLoading } from "react-icons/ai";

interface LoadingSpinnerProps {
    size: number;
}

const LoadingSpinner = ({ size }: LoadingSpinnerProps) => (
    <AiOutlineLoading
        size={size}
        className="animate-spin"
        data-test-id="loading-spinner"
    />
);

export default LoadingSpinner;

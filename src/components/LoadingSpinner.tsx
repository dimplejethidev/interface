import { AiOutlineLoading } from "react-icons/ai";

const LoadingSpinner = ({ size }: { size: number }) => (
    <AiOutlineLoading size={size} className="animate-spin" />
);

export default LoadingSpinner;

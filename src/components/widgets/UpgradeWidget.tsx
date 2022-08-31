import { useState } from "react";
import { ethers } from "ethers";

import NumberEntryField from "../NumberEntryField";
import WidgetContainer from "./WidgetContainer";
import DAIABI from "../../utils/DAIABI.json";
import AqueductTokenABI from "../../utils/AqueductTokenABI.json";
import ToastType from "../../types/toastType";
import LoadingSpinner from "../LoadingSpinner";

const FDAI_ADDRESS = process.env.NEXT_PUBLIC_FDAI_ADDRESS;
const AQUEDUCT_TOKEN0_ADDRESS = process.env.NEXT_PUBLIC_AQUEDUCT_TOKEN0_ADDRESS;
const AQUEDUCT_TOKEN1_ADDRESS = process.env.NEXT_PUBLIC_AQUEDUCT_TOKEN1_ADDRESS;
const DAI_ABI = DAIABI.abi;
const AQUEDUCT_TOKEN_ABI = AqueductTokenABI.abi;

interface UpgradeWidgetProps {
    showToast: (type: ToastType) => {};
}

const UpgradeWidget = ({ showToast }: UpgradeWidgetProps) => {
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    // TODO: Add dropdown for two AQUA tokens (AQUA0 & AQUA1)
    const upgrade = async (amount: string) => {
        try {
            setLoading(true);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const daiContract = new ethers.Contract(
                FDAI_ADDRESS || "",
                DAI_ABI,
                signer
            );
            console.log(AQUEDUCT_TOKEN0_ADDRESS);
            const aqueductToken = new ethers.Contract(
                AQUEDUCT_TOKEN0_ADDRESS || "",
                AQUEDUCT_TOKEN_ABI,
                signer
            );

            const approvedTransaction = await daiContract.approve(
                AQUEDUCT_TOKEN0_ADDRESS,
                amount
            );
            await approvedTransaction.wait();
            console.log("spend approved: ", approvedTransaction);

            const upgradedTransaction = await aqueductToken.upgrade(amount, {
                gasLimit: 500000,
            });
            await upgradedTransaction.wait();
            console.log("Upgraded tokens: ", upgradedTransaction);
            showToast(ToastType.Success);
            setLoading(false);
        } catch (error) {
            console.log("Upgrade error: ", error);
            showToast(ToastType.Error);
            setLoading(false);
        }
    };

    return (
        <section className="flex flex-col items-center w-full">
            <WidgetContainer title="Upgrade">
                <NumberEntryField
                    title="Enter amount to upgrade here"
                    number={amount}
                    setNumber={setAmount}
                />
                {loading ? (
                    <div className="flex justify-center items-center h-14 bg-gradient-to-t from-sky-500 to-blue-500 text-white rounded-2xl outline-2">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <button
                        className="h-14 bg-gradient-to-t from-sky-500 to-blue-500 font-bold rounded-2xl text-white hover:outline outline-2"
                        onClick={() => upgrade(amount)}
                    >
                        Upgrade
                    </button>
                )}
            </WidgetContainer>
        </section>
    );
};

export default UpgradeWidget;

import { useState } from "react";
import { BigNumber, ethers } from "ethers";

import NumberEntryField from "../NumberEntryField";
import WidgetContainer from "./WidgetContainer";
import DAIABI from "../../utils/DAIABI.json";
import AqueductTokenABI from "../../utils/AqueductTokenABI.json";
import ToastType from "../../types/ToastType";
import LoadingSpinner from "../LoadingSpinner";
import { useSigner } from 'wagmi';
import { fDAIxp } from "./../../utils/constants";

const DAI_ABI = DAIABI.abi;
const AQUEDUCT_TOKEN_ABI = AqueductTokenABI.abi;

interface DowngradeWidgetProps {
    showToast: (type: ToastType) => {};
}

const DowngradeWidget = ({ showToast }: DowngradeWidgetProps) => {
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const { data: rainbowSigner } = useSigner();
    const signer = rainbowSigner as ethers.Signer;

    // TODO: Add dropdown for two AQUA tokens (AQUA0 & AQUA1)
    const downgrade = async (amount: string) => {
        try {
            setLoading(true);

            // format ether
            const formattedAmount: BigNumber = ethers.utils.parseUnits(amount, "ether");
            
            // check that wallet is connected by checking for signer
            if (signer == null || signer == undefined) { showToast(ToastType.ConnectWallet); setLoading(false); return }

            const daiContract = new ethers.Contract(
                fDAIxp,
                DAI_ABI,
                signer
            );
            const aqueductToken = new ethers.Contract(
                fDAIxp,
                AQUEDUCT_TOKEN_ABI,
                signer
            );

            const approvedTransaction = await daiContract.approve(
                fDAIxp,
                formattedAmount
            );
            await approvedTransaction.wait();
            console.log("spend approved: ", approvedTransaction);

            const downgradedTransaction = await aqueductToken.downgrade(formattedAmount);
            await downgradedTransaction.wait();
            console.log("Downgraded tokens: ", downgradedTransaction);
            showToast(ToastType.Success);
            setLoading(false);
        } catch (error) {
            console.log("Downgrade error: ", error);
            showToast(ToastType.Error);
            setLoading(false);
        }
    };

    return (
        <section className="flex flex-col items-center w-full mt-12">
            <WidgetContainer title="Unwrap">
                <NumberEntryField
                    title="Enter amount to downgrade here"
                    number={amount}
                    setNumber={setAmount}
                />

                {loading ? (
                    <div className="flex justify-center items-center h-14 bg-aqueductBlue/90 text-white rounded-2xl outline-2">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <button
                        className="h-14 bg-aqueductBlue/90 font-bold rounded-2xl text-white hover:outline outline-2"
                        onClick={() => downgrade(amount)}
                    >
                        Unwrap
                    </button>
                )}
            </WidgetContainer>
        </section>
    );
};

export default DowngradeWidget;

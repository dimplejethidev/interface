import { useState } from "react";
import { ethers } from "ethers";

import NumberEntryField from "../NumberEntryField";
import WidgetContainer from "../WidgetContainer";
import DAIABI from "../../utils/DAIABI.json";
import AqueductTokenABI from "../../utils/AqueductTokenABI.json";

declare var window: any; // so that we can access ethereum object - TODO: add interface to more gracefully solve this

const FDAI_ADDRESS = process.env.NEXT_PUBLIC_FDAI_ADDRESS;
const AQUEDUCT_TOKEN0_ADDRESS = process.env.NEXT_PUBLIC_AQUEDUCT_TOKEN0_ADDRESS;
const AQUEDUCT_TOKEN1_ADDRESS = process.env.NEXT_PUBLIC_AQUEDUCT_TOKEN1_ADDRESS;
const DAI_ABI = DAIABI;
const AQUEDUCT_TOKEN_ABI = AqueductTokenABI.abi;

const DowngradeWidget = () => {
    const [amount, setAmount] = useState("");
    console.log(FDAI_ADDRESS);
    console.log(AQUEDUCT_TOKEN0_ADDRESS);
    console.log(AQUEDUCT_TOKEN1_ADDRESS);

    // TODO: Add dropdown for two AQUA tokens (AQUA0 & AQUA1)
    const downgrade = async (amount: string) => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const daiContract = new ethers.Contract(
                FDAI_ADDRESS || "",
                DAI_ABI,
                signer
            );
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

            const downgradedTransaction = await aqueductToken.downgrade(amount);
            await downgradedTransaction.wait();
            console.log("Downgraded tokens: ", downgradedTransaction);
        } catch (error) {
            console.log("Downgrade error: ", error);
        }
    };

    return (
        <section className="flex flex-col items-center w-full text-white">
            <WidgetContainer title="Downgrade">
                <NumberEntryField
                    title="Enter amount to downgrade here"
                    number={amount}
                    setNumber={setAmount}
                />

                <button
                    className="h-14 bg-blue-500 font-bold rounded-2xl hover:outline outline-2 text-white"
                    onClick={() => downgrade(amount)}
                >
                    Downgrade
                </button>
            </WidgetContainer>
        </section>
    );
};

export default DowngradeWidget;

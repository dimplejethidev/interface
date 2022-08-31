import { useState } from "react";
import { ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";

import AddressEntryField from "../AddressEntryField";
import NumberEntryField from "../NumberEntryField";
import WidgetContainer from "../WidgetContainer";
import ToastType from "../../types/toastType";
import LoadingSpinner from "../LoadingSpinner";
import getPoolAddress from "../../helpers/getPool";
import { useStore } from "../../store";

const AQUEDUCT_TOKEN0_ADDRESS = process.env.NEXT_PUBLIC_AQUEDUCT_TOKEN0_ADDRESS;
const AQUEDUCT_TOKEN1_ADDRESS = process.env.NEXT_PUBLIC_AQUEDUCT_TOKEN1_ADDRESS;

interface CreateStreamWidgetProps {
    showToast: (type: ToastType) => {};
}

const CreateStreamWidget = ({ showToast }: CreateStreamWidgetProps) => {
    const store = useStore();

    const [pool, setPool] = useState("");
    const [swapFlowRate, setSwapFlowRate] = useState("");
    const [loading, setLoading] = useState(false);

    const swap = async () => {
        try {
            setLoading(true);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const chainId = await window.ethereum.request({
                method: "eth_chainId",
            });
            const superfluid = await Framework.create({
                chainId: Number(chainId),
                provider: provider,
            });

            const pool = getPoolAddress(
                store.inboundToken,
                store.outboundToken
            );

            const createFlowOperation = superfluid.cfaV1.createFlow({
                receiver: pool,
                flowRate: swapFlowRate,
                superToken: AQUEDUCT_TOKEN0_ADDRESS || "",
            });
            const result = await createFlowOperation.exec(signer);
            await result.wait();

            console.log("Stream created: ", result);
            showToast(ToastType.Success);
            setLoading(false);
        } catch (error) {
            console.log("Error: ", error);
            showToast(ToastType.Error);
            setLoading(false);
        }
    };

    return (
        <section className="flex flex-col items-center w-full">
            <WidgetContainer title="Swap">
                <AddressEntryField />
                <NumberEntryField
                    title="FlowRate ( wei / sec )"
                    number={swapFlowRate}
                    setNumber={setSwapFlowRate}
                />

                {loading ? (
                    <div className="flex justify-center items-center h-14 bg-gradient-to-t from-sky-500 to-blue-500 text-white rounded-2xl outline-2">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <button
                        className="h-14 bg-gradient-to-t from-sky-500 to-blue-500 text-white font-bold rounded-2xl hover:outline outline-2"
                        onClick={() => swap()}
                    >
                        Swap
                    </button>
                )}
            </WidgetContainer>
        </section>
    );
};

export default CreateStreamWidget;

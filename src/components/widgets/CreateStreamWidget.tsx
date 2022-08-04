import { useState } from "react";
import { ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";

import AddressEntryField from "../AddressEntryField";
import NumberEntryField from "../NumberEntryField";
import WidgetContainer from "../WidgetContainer";

declare var window: any; // so that we can access ethereum object - TODO: add interface to more gracefully solve this

const SUPER_APP_ADDRESS = "0x35aE4f514a374900Ee47c489129C7d98739F9Aeb";
const AQUEDUCT_TOKEN0_ADDRESS = "0x6130677802D32e430c72DbFdaf90d6d058137f0F";
const AQUEDUCT_TOKEN1_ADDRESS = "0x9103E14E3AaF4E136BFe6AF1Bf2Aeff8fc5b99b9";

const CreateStreamWidget = () => {
    const [address, setAddress] = useState("");
    const [swapFlowRate, setSwapFlowRate] = useState("");

    const swap = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const chainId = await window.ethereum.request({
                method: "eth_chainId",
            });
            const superfluid = await Framework.create({
                chainId: Number(chainId),
                provider: provider,
            });

            const createFlowOperation = superfluid.cfaV1.createFlow({
                receiver: address,
                flowRate: swapFlowRate,
                superToken: AQUEDUCT_TOKEN1_ADDRESS,
            });
            const result = await createFlowOperation.exec(signer);
            await result.wait();

            console.log("Stream created: ", result);
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    return (
        <section className="flex flex-col items-center w-full text-white">
            <WidgetContainer title="Swap">
                <AddressEntryField
                    title="Address"
                    address={address}
                    setAddress={setAddress}
                />
                <NumberEntryField
                    title="FlowRate ( wei / sec )"
                    number={swapFlowRate}
                    setNumber={setSwapFlowRate}
                />

                <button
                    className="h-14 bg-blue-500 font-bold rounded-2xl hover:outline outline-2 text-white"
                    onClick={() => swap()}
                >
                    Swap
                </button>
            </WidgetContainer>
        </section>
    );
};

export default CreateStreamWidget;

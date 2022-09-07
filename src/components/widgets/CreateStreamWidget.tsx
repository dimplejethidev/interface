import { useState } from "react";
import { BigNumber, ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";

import TokenSelectField from "../TokenSelectField";
import NumberEntryField from "../NumberEntryField";
import WidgetContainer from "./WidgetContainer";
import ToastType from "../../types/ToastType";
import LoadingSpinner from "../LoadingSpinner";
import getPoolAddress from "../../helpers/getPool";
import { useStore } from "../../store";
import { useNetwork, useProvider, useSigner } from 'wagmi';
import Token from "../../types/Token";
import { ETHxp, fDAIxp, fUSDCxp } from "./../../utils/constants";
import tokens from "../../utils/tokens";

interface CreateStreamWidgetProps {
    showToast: (type: ToastType) => {};
}

const CreateStreamWidget = ({ showToast }: CreateStreamWidgetProps) => {
    const store = useStore();

    const [pool, setPool] = useState("");
    const [swapFlowRate, setSwapFlowRate] = useState("");
    const [loading, setLoading] = useState(false);

    const provider = useProvider();
    const { data: rainbowSigner } = useSigner();
    const signer = rainbowSigner as ethers.Signer;
    const { chain, chains } = useNetwork();

    const swap = async () => {
        try {
            setLoading(true);

            // format ether
            const formattedFlowRate: BigNumber = ethers.utils.parseUnits(swapFlowRate, "ether");

            // check that wallet is connected by checking for signer
            if (signer == null || signer == undefined) { showToast(ToastType.ConnectWallet); setLoading(false); return }

            const chainId = chain?.id;
            const superfluid = await Framework.create({
                chainId: Number(chainId),
                provider: provider,
            });

            const pool = getPoolAddress(
                store.inboundToken,
                store.outboundToken
            );

            // TODO: Create getToken helper function
            const token = tokens.get(store.outboundToken)?.address;

            if (token) {
                const createFlowOperation = superfluid.cfaV1.createFlow({
                    receiver: pool,
                    flowRate: formattedFlowRate.toString(),
                    superToken: token,
                });
                const result = await createFlowOperation.exec(signer);
                await result.wait();

                console.log("Stream created: ", result);
                showToast(ToastType.Success);
                setLoading(false);
            }
        } catch (error) {
            console.log("Error: ", error);
            showToast(ToastType.Error);
            setLoading(false);
        }
    };

    return (
        <section className="flex flex-col items-center w-full">
            <WidgetContainer title="Swap">
                <TokenSelectField />
                <NumberEntryField
                    title="FlowRate ( ether / sec )"
                    number={swapFlowRate}
                    setNumber={setSwapFlowRate}
                />

                {loading ? (
                    <div className="flex justify-center items-center h-14 bg-aqueductBlue/90 text-white rounded-2xl outline-2">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <button
                        className="h-14 bg-aqueductBlue/90 text-white font-bold rounded-2xl hover:outline outline-2"
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

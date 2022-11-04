import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";
import { useAccount, useNetwork, useProvider, useSigner } from "wagmi";

import NumberEntryField from "../NumberEntryField";
import WidgetContainer from "./WidgetContainer";
import ToastType from "../../types/ToastType";
import LoadingSpinner from "../LoadingSpinner";
import getPoolAddress from "../../helpers/getPool";
import { useStore } from "../../store";
import TokenDropdown from "../TokenDropdown";
import PricingField from "../PricingField";
import flowrates from "../../utils/flowrates";
import TransactionButton from "../TransactionButton";

interface ProvideLiquidityWidgetProps {
    showToast: (type: ToastType) => {};
}

const ProvideLiquidityWidget = ({ showToast }: ProvideLiquidityWidgetProps) => {
    const store = useStore();
    const provider = useProvider();
    const { data: rainbowSigner } = useSigner();
    const signer = rainbowSigner as ethers.Signer;
    const { address } = useAccount();
    const { chain } = useNetwork();

    const [flowRate0, setFlowRate0] = useState("");
    const [flowRate1, setFlowRate1] = useState("");
    const [loading, setLoading] = useState(false);
    const [token1Price, setToken1Price] = useState(0);
    const [refreshingPrice, setRefreshingPrice] = useState(false);
    const [poolExists, setPoolExists] = useState(true);

    const provideLiquidity = async () => {
        try {
            setLoading(true);

            if (signer == null || signer == undefined) {
                showToast(ToastType.ConnectWallet);
                setLoading(false);
                return;
            }

            const chainId = chain?.id;
            const superfluid = await Framework.create({
                chainId: Number(chainId),
                provider: provider,
            });

            const pool = getPoolAddress(
                store.inboundToken.value,
                store.outboundToken.value
            );

            const token0 = store.outboundToken.address;
            const token1 = store.inboundToken.address;

            if (token0 && token1 && pool) {
                const createFlowOperation0 = superfluid.cfaV1.createFlow({
                    receiver: pool,
                    flowRate: flowRate0,
                    superToken: token0,
                });
                const createFlowOperation1 = superfluid.cfaV1.createFlow({
                    receiver: pool,
                    flowRate: flowRate1,
                    superToken: token1,
                });
                const batchCall = superfluid.batchCall([
                    createFlowOperation0,
                    createFlowOperation1,
                ]);
                const result = await batchCall.exec(signer);
                await result.wait();

                console.log("Streams created: ", result);
                showToast(ToastType.Success);
                setLoading(false);
            }
        } catch (error) {
            console.log("Error: ", error);
            showToast(ToastType.Error);
            setLoading(false);
        }
    };

    // refresh spot pricing upon user input
    useEffect(() => {
        const refreshPrice = async () => {
            setRefreshingPrice(true);

            const token0Address = store.outboundToken.address;
            const token1Address = store.inboundToken.address;

            const poolABI = [
                "function getFlowIn(address token) external view returns (uint128 flowIn)",
            ];

            try {
                const poolAddress = getPoolAddress(
                    store.inboundToken.value,
                    store.outboundToken.value
                );
                setPoolExists(true);
                const poolContract = new ethers.Contract(
                    poolAddress,
                    poolABI,
                    provider
                );

                // get flows
                var token0Flow: BigNumber = await poolContract.getFlowIn(
                    token0Address
                );
                var token1Flow: BigNumber = await poolContract.getFlowIn(
                    token1Address
                );

                // calculate new flows
                if (flowRate0 != "") {
                    token0Flow = token0Flow.add(flowRate0);
                }
                if (flowRate1 != "") {
                    token1Flow = token1Flow.add(flowRate1);
                }

                // calculate price multiple
                if (token0Flow.gt(0)) {
                    setToken1Price(
                        token1Flow.mul(100000).div(token0Flow).toNumber() /
                        100000
                    );
                } else {
                    setToken1Price(0);
                }

                await new Promise((res) => setTimeout(res, 900));
                setRefreshingPrice(false);
            } catch (err) {
                console.log(err);
                setRefreshingPrice(false);
                setPoolExists(false);
            }
        };

        refreshPrice();
    }, [flowRate0, flowRate1, store.inboundToken, store.outboundToken, address, chain]);

    return (
        <section className="flex flex-col items-center w-full">
            <WidgetContainer title="Provide Liquidity">
                <div className="space-y-3">
                    <TokenDropdown
                        selectTokenOption={store.outboundToken}
                        setToken={store.setOutboundToken}
                    />
                    <NumberEntryField
                        title="Flow Rate"
                        number={flowRate0}
                        setNumber={setFlowRate0}
                        dropdownItems={flowrates}
                        dropdownValue={store.flowrateUnit}
                        setDropdownValue={store.setFlowrateUnit}
                        isEther={true}
                    />
                </div>
                <div className="space-y-3">
                    <TokenDropdown
                        selectTokenOption={store.inboundToken}
                        setToken={store.setInboundToken}
                    />
                    <NumberEntryField
                        title="Flow Rate"
                        number={flowRate1}
                        setNumber={setFlowRate1}
                        dropdownItems={flowrates}
                        dropdownValue={store.flowrateUnit}
                        setDropdownValue={store.setFlowrateUnit}
                        isEther={true}
                    />
                </div>
                <PricingField
                    refreshingPrice={refreshingPrice}
                    token1Price={token1Price}
                    poolExists={poolExists}
                />
                <TransactionButton
                    title="Provide Liquidity"
                    loading={loading}
                    onClickFunction={provideLiquidity}
                    errorMessage={!flowRate0 || BigNumber.from(flowRate0).lte(0) || !flowRate1 || BigNumber.from(flowRate1).lte(0) ? 'Enter flow rates' : undefined}
                />
            </WidgetContainer>
        </section>
    );
};

export default ProvideLiquidityWidget;

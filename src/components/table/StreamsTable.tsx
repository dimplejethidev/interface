import { useEffect, useState } from "react";
import { Framework } from "@superfluid-finance/sdk-core";
import { useAccount, useNetwork, useProvider } from "wagmi";
import BalancesField from "./BalancesField";
import GenericTable from "./GenericTable";
import { fDAIxp, fDAIxpfUSDCxpPool, fUSDCxp } from "../../utils/constants";
import getToken from "../../utils/getToken";
import TextField from "./TextField";
import PoolField from "./PoolField";
import { ExplicitAny } from "../../types/ExplicitAny";

const StreamsTable = () => {
    const provider = useProvider();
    const { chain } = useNetwork();
    const { address } = useAccount();

    const [data, setData] = useState<ExplicitAny[][]>();
    const [links, setLinks] = useState<string[]>();

    const [isLoading, setIsLoading] = useState(true);

    // get streams from pool contract
    // TODO: router/factory contract to track current streams so we don't have to manually check here
    useEffect(() => {
        async function updateData() {
            if (!address || !chain || !provider) {
                return;
            }

            const chainId = chain?.id;
            const sf = await Framework.create({
                chainId: Number(chainId),
                provider,
            });

            const pools = [
                { token0: fDAIxp, token1: fUSDCxp, address: fDAIxpfUSDCxpPool },
            ];

            const newData: ExplicitAny[][] = [];
            const newLinks: ExplicitAny[] = [];
            await Promise.all(
                pools.map(async (p) => {
                    const s = await sf.cfaV1.getFlow({
                        superToken: p.token0,
                        sender: address,
                        receiver: p.address,
                        providerOrSigner: provider,
                    });

                    const token0 = await getToken({
                        tokenAddress: p.token0,
                        provider,
                        chainId,
                    });
                    const token1 = await getToken({
                        tokenAddress: p.token1,
                        provider,
                        chainId,
                    });

                    if (s.flowRate !== "0" && token0 && token1) {
                        const date = new Date(s.timestamp);
                        newData.push([
                            { token0, token1 },
                            { title: date.toLocaleDateString() },
                            { token0, token1 },
                        ]);
                        newLinks.push(
                            `pair/goerli/${address}/${token0.address}/${token1.address}`
                        );
                    } else {
                        const s2 = await sf.cfaV1.getFlow({
                            superToken: p.token1,
                            sender: address,
                            receiver: p.address,
                            providerOrSigner: provider,
                        });

                        if (s2.flowRate !== "0" && token0 && token1) {
                            const date = new Date(s2.timestamp);
                            newData.push([
                                { token0, token1 },
                                { title: date.toLocaleDateString() },
                                { token0, token1 },
                            ]);
                            newLinks.push(
                                `pair/goerli/${address}/${token0.address}/${token1.address}`
                            );
                        }
                    }
                })
            );

            setData(newData);
            setLinks(newLinks);
            setIsLoading(false);
        }

        updateData();
    }, [address, chain, provider]);

    return (
        <section className="flex flex-col items-center w-full">
            <div className="w-full max-w-6xl">
                <GenericTable
                    title="My Streams"
                    labels={["Pool", "Start Date", "Balances"]}
                    columnProps={[
                        "min-w-[14rem] w-full max-w-[20rem]",
                        "min-w-[7rem] w-full max-w-[16rem]",
                        "min-w-[14rem] w-full max-w-[20rem] hidden lg:flex",
                    ]}
                    columnComponents={[PoolField, TextField, BalancesField]}
                    rowLinks={links}
                    data={data}
                    isLoading={isLoading}
                    noDataMessage={"You currently don't have any streams"}
                />
            </div>
        </section>
    );
};

export default StreamsTable;

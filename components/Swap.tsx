import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";
import AqueductTokenABI from "./../utils/AqueductTokenABI.json";
import DAIABI from "./../utils/DAIABI.json";

const DAI_ADDRESS = "0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735";
const FDAI_ADDRESS = "0x15F0Ca26781C3852f8166eD2ebce5D18265cceb7";
const AQUEDUCT_TOKEN_ADDRESS = "0xD574bdDb27628D5988F7A9AeE01ab548F53c2417";
const SUPER_APP_ADDRESS = "0xa6c21126fa87120F927e5Ad204f681f2fa3e3274";
const DAI_ABI = DAIABI;
const AQUEDUCT_TOKEN_ABI = AqueductTokenABI.abi;

declare var window: any; // so that we can access ethereum object - TODO: add interface to more gracefully solve this

const Swap = () => {
    const [account, setAccount] = useState("");
    const [swapFlowRate, setSwapFlowRate] = useState("");
    const [amount, setAmount] = useState("");

    const connectWallet = async () => {
        const { ethereum } = window;
        if (!ethereum) {
            console.log("Ethereum object not found");
        }
        const accounts = await ethereum.request({
            method: "eth_requestAccounts",
        });

        setAccount(accounts[0]);
        try {
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const upgrade = async (amount: string) => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const daiContract = new ethers.Contract(
                FDAI_ADDRESS,
                DAI_ABI,
                signer
            );
            const aqueductToken = new ethers.Contract(
                AQUEDUCT_TOKEN_ADDRESS,
                AQUEDUCT_TOKEN_ABI,
                signer
            );

            amount = "100000000000000000"; // 100
            const approvedTransaction = await daiContract.approve(
                AQUEDUCT_TOKEN_ADDRESS,
                amount
            );
            await approvedTransaction.wait();
            console.log("Transuperfluider approved: ", approvedTransaction);

            const upgradedTransaction = await aqueductToken.upgrade(amount);
            await upgradedTransaction.wait();
            console.log("Upgraded tokens: ", upgradedTransaction);
        } catch (error) {
            console.log("Upgrade error: ", error);
        }
    };

    const swap = async (flowRate: string) => {
        // const DAIxContract = await superfluid.loadSuperToken("fDAIx");
        // const DAIx = DAIxContract.address;
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
                receiver: SUPER_APP_ADDRESS,
                flowRate: flowRate,
                superToken: AQUEDUCT_TOKEN_ADDRESS,
            });

            const result = await createFlowOperation.exec(signer);
            await result.wait();
            console.log("Stream created: ", result);
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    useEffect(() => {
        connectWallet();
    }, []);

    return (
        <>
            <h2>Initiate a swap</h2>
            <label htmlFor="upgrade">Enter amount to upgrade here </label>
            <input
                type="text"
                id="upgrade"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter the amount you want to upgrade here"
            />
            <button onClick={() => upgrade(amount)}>Upgrade</button>

            <label htmlFor="swap">Enter amount per second here </label>
            <input
                type="text"
                id="swap"
                value={swapFlowRate}
                onChange={(e) => setSwapFlowRate(e.target.value)}
                placeholder="Enter the amount you want to swap per second here"
            />
            <button onClick={() => swap(swapFlowRate)}>Swap</button>
        </>
    );
};

export default Swap;

import { useState } from "react";
import { BigNumber, ethers } from "ethers";

import NumberEntryField from "../NumberEntryField";
import WidgetContainer from "./WidgetContainer";
import DAIABI from "../../utils/DAIABI.json";
import AqueductTokenABI from "../../utils/AqueductTokenABI.json";
import ToastType from "../../types/ToastType";
import LoadingSpinner from "../LoadingSpinner";
import { useSigner } from "wagmi";
import { fDAI, fDAIxp, fUSDC, fUSDCxp } from "./../../utils/constants";
import Dropdown from "../Dropdown";
import Token from "./../../types/Token";
import tokens from "../../utils/tokens";
import { useStore } from "../../store";

const DAI_ABI = DAIABI.abi;
const AQUEDUCT_TOKEN_ABI = AqueductTokenABI.abi;

interface UpgradeWidgetProps {
    showToast: (type: ToastType) => {};
}

const UpgradeWidget = ({ showToast }: UpgradeWidgetProps) => {
    const [amount, setAmount] = useState("");
    const [upgradeToken, setUpgradeToken] = useState<Token>(Token.ETHxp);
    const [loading, setLoading] = useState(false);

    const { data: rainbowSigner } = useSigner();
    const signer = rainbowSigner as ethers.Signer;

    const upgrade = async (amount: string) => {
        try {
            setLoading(true);

            // format ether
            const formattedAmount: BigNumber = ethers.utils.parseUnits(
                amount,
                "ether"
            );

            // check that wallet is connected by checking for signer
            if (signer == null || signer == undefined) {
                showToast(ToastType.ConnectWallet);
                setLoading(false);
                return;
            }
            
            // TODO: Could we use the Superfluid SDK here to get the underlying token?
            const underlyingToken = tokens.get(upgradeToken!.toString())?.address;
            const underlyingTokenContract = new ethers.Contract(
                underlyingToken || "",
                DAI_ABI,
                signer
            );
            
            const wrappedTokenContract = new ethers.Contract(
                fUSDCxp, //fDAIxp,
                AQUEDUCT_TOKEN_ABI,
                signer
                );
                
            const approvedTransaction = await underlyingTokenContract.approve(
                fUSDCxp, //fDAIxp,
                formattedAmount
            );
            await approvedTransaction.wait();
            console.log("spend approved: ", approvedTransaction);

            // TODO: Could we use the Superfluid SDK here to upgrade the underlying token?
            const upgradedTransaction = await wrappedTokenContract.upgrade(
                formattedAmount,
                {
                    gasLimit: 500000,
                }
            );
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
            <WidgetContainer title="Wrap">
                <Dropdown
                    title="Upgrade"
                    dropdownItems={[Token.ETHxp, Token.fDAIxp, Token.fUSDCxp]}
                    setToken={setUpgradeToken}
                />
                <NumberEntryField
                    title="Enter amount to upgrade here"
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
                        onClick={() => upgrade(amount)}
                    >
                        Wrap
                    </button>
                )}
            </WidgetContainer>
        </section>
    );
};

export default UpgradeWidget;

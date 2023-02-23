import { BigNumber, ethers } from "ethers";
import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useState,
} from "react";
import { useAccount, useProvider } from "wagmi";
import { TokenOption } from "../types/TokenOption";

const ANIMATION_MINIMUM_STEP_TIME = 100;
const REFRESH_INTERVAL = 300; // 300 * 100 = 30000 ms = 30 s

interface RealTimeBalanceProps {
    token: TokenOption;
    setBalance: Dispatch<SetStateAction<BigNumber>>;
}

const RealTimeBalance = ({ token, setBalance }: RealTimeBalanceProps) => {
    const [flowRate, setFlowRate] = useState<BigNumber>(
        ethers.BigNumber.from(0)
    );
    const provider = useProvider();
    const { address } = useAccount();

    const updateRealTimeBalanceCallback = useCallback(async () => {
        async function updateRealTimeBalance() {
            const tokenABI = [
                "function realtimeBalanceOf(address account, uint256 timestamp) public view returns (int256 availableBalance, uint256 deposit, uint256 owedDeposit)",
            ];
            if (address) {
                const tokenContract = new ethers.Contract(
                    token.address,
                    tokenABI,
                    provider
                );
                const currentTimestampBigNumber = ethers.BigNumber.from(
                    new Date().valueOf() // Milliseconds elapsed since UTC epoch, disregards timezone.
                );

                // set token state
                const initialBalance = (
                    await tokenContract.realtimeBalanceOf(
                        address,
                        currentTimestampBigNumber.div(1000).toString()
                    )
                ).availableBalance;
                const futureBalance = (
                    await tokenContract.realtimeBalanceOf(
                        address,
                        currentTimestampBigNumber
                            .div(1000)
                            .add(
                                (REFRESH_INTERVAL *
                                    ANIMATION_MINIMUM_STEP_TIME) /
                                    1000
                            )
                            .toString()
                    )
                ).availableBalance;
                setBalance(initialBalance);
                setFlowRate(
                    futureBalance.sub(initialBalance).div(REFRESH_INTERVAL)
                );
            }
        }

        updateRealTimeBalance();
    }, [address, provider, setBalance, token.address]);

    // REFRESH(in milliseconds) = REFRESH_INTERVAL * ANIMATION_MINIMUM_STEP_TIME
    const [time, setTime] = useState(REFRESH_INTERVAL);
    useEffect(() => {
        const timer = setTimeout(() => {
            setTime(time + 1);
            if (time >= REFRESH_INTERVAL) {
                setTime(0);
                updateRealTimeBalanceCallback();
            }

            // animate frame
            setBalance((c) => c.add(flowRate));
        }, ANIMATION_MINIMUM_STEP_TIME);
        return () => {
            clearTimeout(timer);
        };
    }, [flowRate, setBalance, time, updateRealTimeBalanceCallback]);

    useEffect(() => {
        updateRealTimeBalanceCallback();
    }, [address, token, updateRealTimeBalanceCallback]);

    return <div />;
};

export default RealTimeBalance;

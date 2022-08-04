import { createContext, ReactNode, FC, useState, useContext } from "react";
import { BalanceContextType, IBalance } from "../types/balance";

interface Props {
    children: ReactNode;
}

const initialBalance: IBalance = {
    balanceWei: "0",
    balanceTimestamp: 0,
    flowRateWei: "0",
};

const BalanceContext = createContext<BalanceContextType>({
    balance: initialBalance,
    updateBalance: () => {},
});

export const useBalance = () => {
    return useContext(BalanceContext);
};

export const BalanceProvider: FC<Props> = ({ children }) => {
    const [balance, setBalance] = useState<IBalance>(initialBalance);

    const updateBalance = (balance: IBalance) => {
        setBalance(balance);
    };

    return (
        <BalanceContext.Provider value={{ balance, updateBalance }}>
            {children}
        </BalanceContext.Provider>
    );
};

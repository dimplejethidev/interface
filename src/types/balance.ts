export interface IBalance {
  balanceWei: string;
  balanceTimestamp: number;
  flowRateWei: string;
}

export type BalanceContextType = {
  balance: IBalance;
  updateBalance: (balance: IBalance) => void;
};

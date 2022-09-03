export interface IBalance {
    balanceWei: string;
    balanceTimestamp: number;
    flowRateWei: string;
}

export const initialBalance: IBalance = {
    balanceWei: "0",
    balanceTimestamp: 0,
    flowRateWei: "0",
};

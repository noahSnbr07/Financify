import { TransactionWithRelations } from "./get-dashboard-data";

interface _props {
    transactions: TransactionWithRelations[];
}

async function getTotalBalance({ transactions }: _props): Promise<number> {

    const initialTotalBalance = 0;
    const totalBalance = transactions.reduce(function (accumulator, currentValue) {
        if (currentValue.received) return accumulator + currentValue.value.toNumber();
        else return accumulator - currentValue.value.toNumber();
    }, initialTotalBalance);

    return totalBalance;

}

export default getTotalBalance;
import { TransactionWithRelations } from "./get-dashboard-data";

interface _props {
    transactions: TransactionWithRelations[];
}

type AccountVolumes = {
    negativeSum: number;
    positiveSum: number;
    totalSum: number;
}

async function getAccountVolumes({ transactions, accountId, }: _props & { accountId: string }): Promise<AccountVolumes> {
    const accountTransactions = transactions.filter(
        transaction => transaction.accountId === accountId
    );

    return accountTransactions.reduce(
        (volumes, transaction) => {
            const value = transaction.value.toNumber();

            if (transaction.received) {
                volumes.positiveSum += value;
            } else {
                volumes.negativeSum += value;
            }

            volumes.totalSum += value;
            return volumes;
        },
        { totalSum: 0, negativeSum: 0, positiveSum: 0 }
    );
}

export default getAccountVolumes;
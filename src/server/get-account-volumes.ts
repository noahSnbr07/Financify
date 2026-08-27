import { database } from "../configuration";
import getAuth from "./get-auth";

interface _props {
    accountId: string;
}

type AccountVolumes = {
    negativeSum: number;
    positiveSum: number;
    totalSum: number;
}

async function getAccountVolumes({ accountId }: _props): Promise<AccountVolumes> {

    const defaultVolumes: Readonly<AccountVolumes> = {
        totalSum: 0,
        negativeSum: 0,
        positiveSum: 0,
    }

    const auth = await getAuth();
    if (!auth) return defaultVolumes;

    const transactions = await database.transaction.findMany({
        where: { account: { id: accountId }, },
        select: { value: true, received: true, }
    });

    if (transactions.length < 1) return defaultVolumes;

    const totalVolume = transactions.reduce(function (accumulator, currentValue) {
        if (currentValue.received) return accumulator + currentValue.value.toNumber();
        else return accumulator;
    }, 0);

    const totalNegativeVolume = transactions.reduce(function (accumulator, currentValue) {
        if (!currentValue.received) return accumulator + currentValue.value.toNumber();
        else return accumulator;
    }, 0);

    const totalPositiveVolume = transactions.reduce(function (accumulator, currentValue) {
        if (currentValue.received) return accumulator + currentValue.value.toNumber();
        else return accumulator;
    }, 0);

    return {
        totalSum: totalVolume,
        positiveSum: totalPositiveVolume,
        negativeSum: totalNegativeVolume,
    }

}
export default getAccountVolumes;
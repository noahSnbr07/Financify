import { database } from "../configuration";

interface _props {
    accountId: string;
}

async function getTotalAccountVolume({ accountId }: _props) {

    const transactions = await database.transaction.findMany({
        where: {
            account: {
                id: accountId
            }
        }
    });

    const initialTotalBalance = 0;
    const totalBalance = transactions.reduce(function (accumulator, currentValue) {
        if (currentValue.received) return accumulator + currentValue.value.toNumber();
        else return accumulator - currentValue.value.toNumber();
    }, initialTotalBalance);

    return Number(totalBalance.toFixed(2));

}

export default getTotalAccountVolume;
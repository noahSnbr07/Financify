import { database } from "../configuration";
import { User } from "../interfaces";

interface _props {
    accountId: string;
    auth: User;
}

async function getTotalAccountVolume({ accountId, auth }: _props) {

    const transactions = await database.transaction.findMany({
        where: {
            account: {
                id: accountId
            },
            user: {
                id: auth.id
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
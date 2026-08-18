import { database } from "../configuration";
import { TransactionWhereInput } from "../generated/prisma/models";
import getAuth from "./get-auth"

interface _props {
    where: TransactionWhereInput;
}

async function getTotalBalance({ where }: _props): Promise<number> {

    const auth = await getAuth();
    if (!auth) return 0;

    const transactions = await database.transaction.findMany({
        where: {
            ...where,
            user: {
                id: auth.id,
            },
        }
    });

    const initialTotalBalance = 0;
    const totalBalance = transactions.reduce(function (accumulator, currentValue) {
        if (currentValue.received) return accumulator + currentValue.value.toNumber();
        else return accumulator - currentValue.value.toNumber();
    }, initialTotalBalance);

    return totalBalance;

}

export default getTotalBalance;
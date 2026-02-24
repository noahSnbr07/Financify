import { database } from "../configuration";
import { Category } from "../generated/prisma/client";
import getAuth from "./get-auth";

interface Props {
    category: Category;
}

async function getCategoryVolume({ category }: Props): Promise<number | null> {
    const auth = await getAuth();
    if (!auth) return null;

    const transactions = await database.transaction.findMany({
        where: {
            userId: auth.id,
            categoryId: category.id,
        },
        select: {
            value: true,
        },
    });

    const volume = transactions.reduce((sum, tx) => {
        return sum + Math.abs(tx.value.toNumber());
    }, 0);

    return volume;
}

export default getCategoryVolume;
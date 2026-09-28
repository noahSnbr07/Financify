import { database } from "../configuration";
import { Category } from "../generated/prisma/client";
import { User } from "../interfaces";

interface Props {
    category: Category;
    auth: User;
}

async function getCategoryVolume({ auth, category }: Props): Promise<number | null> {

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
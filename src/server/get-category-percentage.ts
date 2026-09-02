import { database } from "../configuration";
import { Transaction } from "../generated/prisma/client";
import { CategoryPercentage } from "./get-dashboard-data";

interface _props {
    transactions: Transaction[];
}

async function getCategoryPercentage({ transactions }: _props): Promise<CategoryPercentage[]> {
    // Get total OUT-transactions (received = false)
    const totalSpending = transactions.reduce(function (accumulator, currentValue) {
        if (!currentValue.received) return accumulator + currentValue.value.toNumber();
        else return accumulator;
    }, 0);

    if (totalSpending === 0) return [];

    // Group spending by categoryId
    const categoryTotalSpending: { [categoryId: string]: number } = {};

    transactions
        .filter((transaction) => !transaction.received)
        .forEach((transaction) => {
            if (!categoryTotalSpending[transaction.categoryId]) {
                categoryTotalSpending[transaction.categoryId] = 0;
            }
            categoryTotalSpending[transaction.categoryId] += transaction.value.toNumber();
        });

    // Fetch category data for these IDs
    const categoryIds = Object.keys(categoryTotalSpending);
    const categories = await database.category.findMany({
        where: {
            id: { in: categoryIds },
        },
    });

    // Map to CategoryPercentage with calculated percentages
    const categoryPercentages: CategoryPercentage[] = categories.map((category) => ({
        ...category,
        percentage: Number(
            ((categoryTotalSpending[category.id] / totalSpending) * 100).toFixed(2)
        ),
    }));

    return categoryPercentages;
}

export default getCategoryPercentage;
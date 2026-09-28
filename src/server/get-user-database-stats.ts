import { database } from "../configuration";

interface _props {
    userId: string;
}

export interface UserDatabaseStats {
    totalTransactions: number;
    totalCategories: number;
    totalAccounts: number;
    totalFiles: number;
    totalSubscriptions: number;
}

async function getUserDatabaseStats({ userId }: _props) {

    const [totalTransactions, totalCategories, totalAccounts, totalFiles, subscriptions] = await Promise.all([
        await database.transaction.count({ where: { userId } }),
        await database.category.count({ where: { userId } }),
        await database.account.count({ where: { userId } }),
        await database.file.count({ where: { userId } }),
        await database.subscription.count({ where: { userId } }),
    ]);

    return {
        totalTransactions, totalCategories, totalAccounts, totalFiles, subscriptions,
    }
}

export default getUserDatabaseStats;
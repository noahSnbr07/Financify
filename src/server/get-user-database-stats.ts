import { database } from "../configuration";

interface _props {
    userId: string;
}

export interface UserDatabaseStats {
    totalTransactions: number;
    totalCategories: number;
    totalAccounts: number;
    totalReports: number;
}

async function getUserDatabaseStats({ userId }: _props) {

    const [totalTransactions, totalCategories, totalAccounts, totalReports] = await Promise.all([
        await database.transaction.count({ where: { userId } }),
        await database.category.count({ where: { userId } }),
        await database.account.count({ where: { userId } }),
        await database.report.count({ where: { userId } }),
    ]);

    return {
        totalTransactions, totalCategories, totalAccounts, totalReports
    }
}

export default getUserDatabaseStats;
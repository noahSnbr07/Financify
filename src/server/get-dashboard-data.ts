import { database } from "../configuration";
import { Account, Category, Transaction } from "../generated/prisma/client";
import { TransactionWhereInput } from "../generated/prisma/models";
import getAuth from "./get-auth";
import getCategoryVolume from "./get-category-volume";
import getTotalBalance from "./get-total-balance";

interface _props {
    range: number;
}

export interface ParsedExtendedTransaction extends Omit<Transaction, "value"> {
    account: { name: string; };
    category: { name: string; };
    value: number;
}

export interface ParsedExtendedCategory extends Category {
    volume: number | null;
}

interface GetDashboardDataProps {
    transactions: ParsedExtendedTransaction[];
    categories: ParsedExtendedCategory[];
    totalBalance: number;
    accounts: Account[];
}

async function getDashboardData({ range }: _props): Promise<GetDashboardDataProps> {


    const auth = await getAuth();
    if (!auth) return {
        categories: [],
        transactions: [],
        accounts: [],
        totalBalance: 0,
    };

    const transactionFilter: TransactionWhereInput = {
        userId: auth.id,
    };

    if (range > 0) {
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - range);

        transactionFilter.created = {
            gte: fromDate,
        };
    }

    const [transactions, categories, accounts] = await Promise.all([

        database.transaction.findMany({
            where: transactionFilter,
            include: {
                account: { select: { name: true } },
                category: { select: { name: true } },
            },
            orderBy: { created: "asc" },
        }),

        database.category.findMany({
            where: {
                userId: auth.id,
                transactions: {
                    some: transactionFilter,
                },
            },
        }),

        database.account.findMany({
            where: {
                userId: auth.id,
                transactions: {
                    some: transactionFilter,
                },
            },
        }),
    ]);

    const parsedTransactions = transactions.map(function (transaction) {
        return { ...transaction, value: transaction.value.toNumber() }
    });

    const parsedCategories = await Promise.all(
        categories.map(async function (category) {
            return { ...category, volume: await getCategoryVolume({ category }) }
        })
    );

    const totalBalance = await getTotalBalance({ where: transactionFilter });
    return {
        categories: parsedCategories,
        transactions: parsedTransactions,
        totalBalance: totalBalance,
        accounts: accounts,
    }
}

export default getDashboardData;
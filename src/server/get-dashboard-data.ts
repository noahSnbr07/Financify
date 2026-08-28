import { database } from "../configuration";
import { Account, Category, Transaction } from "../generated/prisma/client";
import { TransactionWhereInput } from "../generated/prisma/models";
import getAccountVolumes from "./get-account-volumes";
import getAuth from "./get-auth";
import getBudget from "./get-budget";
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

export interface ParsedAccount extends Omit<Account, "created" | "updated" | "userId"> {
    negativeSum: number;
    positiveSum: number;
}


export interface ParsedExtendedCategory extends Category {
    volume: number | null;
}

interface GetDashboardDataProps {
    totalBalance: number;
    budgetExceeded: number;
    transactions: ParsedExtendedTransaction[];
    categories: ParsedExtendedCategory[];
    accounts: ParsedAccount[];
}

async function getDashboardData({ range }: _props): Promise<GetDashboardDataProps> {


    const auth = await getAuth();
    if (!auth) return {
        categories: [],
        transactions: [],
        accounts: [],
        totalBalance: 0,
        budgetExceeded: 0,
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

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const budget = await getBudget();

    type TransactionWithRelations = Transaction & {
        account: { name: string; };
        category: { name: string; };
    };

    type expectedData = [TransactionWithRelations[], Category[], Account[], Transaction[]]

    const [transactions, categories, accounts, transactionsThisMonth]: expectedData = await Promise.all([

        database.transaction.findMany({
            where: transactionFilter,
            include: {
                account: { select: { name: true } },
                category: { select: { name: true } },
            }, orderBy: { created: "asc" },
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

        database.transaction.findMany({
            where: {
                userId: auth.id,
                created: {
                    gte: startOfMonth,
                    lt: startOfNextMonth
                }
            }
        })

    ]);

    const parsedAccounts: ParsedAccount[] = await Promise.all(accounts.map(async (account) => {

        const sums = await getAccountVolumes({ accountId: account.id });

        return {
            ...account,
            negativeSum: sums.negativeSum,
            positiveSum: sums.positiveSum,
        }
    }))

    const monthlyTotal = transactionsThisMonth
        .filter((t) => !t.received)
        .reduce((accumulator, currentValue) => accumulator + currentValue.value.toNumber(), 0);

    const budgetExceededInPercentage = Number(((monthlyTotal / budget) * 100).toFixed(2));

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
        accounts: parsedAccounts,
        budgetExceeded: budgetExceededInPercentage,
    }
}

export default getDashboardData;
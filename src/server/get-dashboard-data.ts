import { database } from "../configuration";
import { Account, Category, Subscription, SubscriptionInterval, Transaction } from "../generated/prisma/client";
import { TransactionWhereInput } from "../generated/prisma/models";
import getAccountVolumes from "./get-account-volumes";
import getBudget from "./get-budget";
import getCategoryPercentage from "./get-category-percentage";
import getCategoryVolume from "./get-category-volume";
import getTotalBalance from "./get-total-balance";
import getTotalAccountVolume from "./get-total-account-volume";
import generateSubscriptionsForecast from "./generate-subscriptions-forecast";
import getColorForBudgetExceeding from "./get-color-for-budget-exceeding";
import { User } from "../interfaces";
import { Decimal } from "../generated/prisma/internal/prismaNamespace";

interface _props {
    range: number;
    auth: User;
}

export interface ParsedTransaction extends Omit<Transaction, "value"> {
    account: { name: string; };
    category: { name: string; };
    value: number;
}
export interface ParsedAccount extends Omit<Account, "created" | "updated" | "userId"> {
    negativeSum: number;
    positiveSum: number;
    volume: number;
}
export interface CategoryPercentage extends Category {
    percentage: number;
    color: string;
}
export interface ParsedCategory extends Category {
    volume: number | null;
}

export type ParsedSubscription = Omit<Subscription, "value"> & { value: number; };

export type Billing = {
    name: string;
    value: number;
    nextBillingDate: Date;
    interval: SubscriptionInterval
    account: { name: string; color: string; },
    category: { name: string; color: string; }
};

export type Averages = {
    weekly: number;
    monthly: number;
    quarterly: number;
    annual: number;
}

export interface SubscriptionForecast {
    averages: Averages;
    billings: Billing[];
}

//return type
interface GetDashboardDataProps {
    totalBalance: number;
    budgetExceeded: number;
    transactions: ParsedTransaction[];
    categories: ParsedCategory[];
    accounts: ParsedAccount[];
    categoryPercentages: CategoryPercentage[];
    subscriptions: ParsedSubscription[];
    subscriptionForecast: SubscriptionForecast;
    budgetIndexColor: string;
}

export type TransactionWithRelations = Transaction & {
    account: { name: string; };
    category: { name: string; };
};

type CategoryWithTransaction = Category & {
    transactions: {
        value: Decimal;
        received: boolean;
    }[]
}


async function getDashboardData({ range, auth }: _props): Promise<GetDashboardDataProps> {

    try {
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

        type expectedData = [TransactionWithRelations[], CategoryWithTransaction[], Account[], Transaction[], Subscription[]]

        const [transactions, categories, accounts, transactionsThisMonth, subscriptions]: expectedData = await Promise.all([

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
                include: {
                    transactions: {
                        select: {
                            value: true,
                            received: true,
                        }
                    }
                }
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
                    },
                },
            }),

            database.subscription.findMany({
                where: { userId: auth.id }
            })

        ]);
        const monthlyTotal = transactionsThisMonth
            .filter((t) => !t.received)
            .reduce((accumulator, currentValue) => accumulator + currentValue.value.toNumber(), 0);
        const parsedCategories = await Promise.all(
            categories.map(async function (category) {
                const transactionsWithParsedValues = category.transactions.map((t: { value: Decimal; received: boolean }) => ({
                    ...t,
                    value: t.value.toNumber(),
                }));

                return {
                    ...category,
                    transactions: transactionsWithParsedValues,
                    volume: await getCategoryVolume({ auth, category }),
                    color: category.color,
                }
            })
        );

        const parsedAccounts: ParsedAccount[] = await Promise.all(accounts.map(async (account) => {

            const sums = await getAccountVolumes({ transactions, accountId: account.id });
            const volume = await getTotalAccountVolume({ auth, accountId: account.id });

            return {
                ...account,
                negativeSum: Math.round(sums.negativeSum),
                positiveSum: Math.round(sums.positiveSum),
                volume: Math.round(volume),
            }
        }));

        const parsedTransactions = transactions.map(function (transaction) {
            return { ...transaction, value: transaction.value.toNumber() }
        });

        const parsedSubscriptions: ParsedSubscription[] = subscriptions.map((s) => ({ ...s, value: Number(s.value) }));

        //server-functions
        const subscriptionForecast = await generateSubscriptionsForecast({ auth });
        const totalBalance = await getTotalBalance({ transactions });
        const budget = await getBudget({ auth });
        const categoryPercentages = await getCategoryPercentage({ transactions: transactionsThisMonth });
        const budgetExceededInPercentage = Number(((monthlyTotal / budget) * 100).toFixed(2));
        const budgetIndexColor = await getColorForBudgetExceeding({ exceeding: budgetExceededInPercentage });

        return {
            categories: parsedCategories,
            transactions: parsedTransactions,
            totalBalance: totalBalance,
            accounts: parsedAccounts,
            budgetExceeded: budgetExceededInPercentage,
            categoryPercentages: categoryPercentages,
            subscriptions: parsedSubscriptions,
            subscriptionForecast,
            budgetIndexColor,
        }
    } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
        throw new Error("Uncaught Error in get-dashboard-data.ts");
    }

}

export default getDashboardData;
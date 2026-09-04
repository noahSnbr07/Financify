import Screen from "@/src/global/components/server/screen";
import { AccountChart, AccountVolumes, AIChatBox, BalanceChart, BudgetRadarChart, CategoriesChart, ContentEntry, DateRangeSelector, QuickAccess, SubscriptionData, TotalBalance, TransactionHistory } from "./components";
import { getAuth, getDashboardData } from "@/src/server";
import { redirect } from "next/navigation";
import UpComingBillings from "./components/billings";

interface _props {
    searchParams: Promise<{ range?: number }>;
}

export const revalidate = 60;

async function page({ searchParams }: _props) {
    const { range = 0 } = await searchParams;

    const auth = await getAuth();
    if (!auth) redirect("/authentication");

    const {
        categories,
        totalBalance,
        transactions,
        accounts,
        budgetExceeded,
        categoryPercentages,
        subscriptions,
        subscriptionForecast,
        budgetIndexColor
    } = await getDashboardData({ auth, range });

    return (
        <Screen label="Dashboard">
            <QuickAccess />
            <DateRangeSelector />

            <ContentEntry renderFallback={false} index={0} label="Balance">
                <TotalBalance color={budgetIndexColor} budgetExceeded={budgetExceeded} balance={totalBalance} />
            </ContentEntry>

            <ContentEntry renderFallback={transactions.length < 1} index={1} label="History">
                <BalanceChart transactions={transactions} />
            </ContentEntry>

            <ContentEntry renderFallback={categories.length < 1} index={2} label="Category Interests">
                <BudgetRadarChart categories={categoryPercentages} />
            </ContentEntry>

            <ContentEntry renderFallback={categories.length < 1} index={3} label="Category Volume">
                <CategoriesChart categories={categories} />
            </ContentEntry>

            <ContentEntry renderFallback={accounts.length < 1} index={4} label="Accounts In/Out">
                <AccountChart accounts={accounts} />
            </ContentEntry>

            <ContentEntry renderFallback={subscriptions.length < 1} index={5} label="Billings">
                <UpComingBillings billings={subscriptionForecast.billings} />
            </ContentEntry>

            <ContentEntry renderFallback={subscriptions.length < 1} index={6} label="Subscription Forecast">
                <SubscriptionData averages={subscriptionForecast.averages} />
            </ContentEntry>

            <ContentEntry renderFallback={transactions.length < 1} index={7} label="Transactions">
                <TransactionHistory transactions={transactions} />
            </ContentEntry>

            <ContentEntry renderFallback={accounts.length < 1} index={8} label="Account Balances">
                <AccountVolumes accounts={accounts} />
            </ContentEntry>

            <ContentEntry renderFallback={false} index={9} label="AI Chat">
                <AIChatBox />
            </ContentEntry>
        </Screen>
    );
}

export default page;
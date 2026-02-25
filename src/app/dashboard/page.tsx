import { Screen } from "@/src/global/components";
import { AIChatBox, BalanceChart, CategoriesChart, ContentEntry, DateRangeSelector, Forecast, QuickAccess, TotalBalance } from "./components";
import { getAuth, getDashboardData, getForecast, getTotalAccountVolume } from "@/src/server";
import { redirect } from "next/navigation";
import { GetForecastProps } from "@/src/server/get-forecast";

interface _props {
    searchParams: Promise<{ range?: number }>;
}

export const revalidate = 60;

async function page({ searchParams }: _props) {
    const { range = 0 } = await searchParams;

    const auth = await getAuth();
    if (!auth) redirect("/");

    const { categories, totalBalance, transactions, accounts } = await getDashboardData({ range });
    const forecastData: GetForecastProps = await getForecast();

    return (
        <Screen label="Dashboard">
            <QuickAccess />
            <DateRangeSelector />
            <ContentEntry fallbackMessage="Unable to calculate Balance" renderFallback={false} label="Balance">
                <TotalBalance balance={totalBalance} />
            </ContentEntry>
            <ContentEntry label="Forecast" fallbackMessage="Too few Transactions to generate Forecast" renderFallback={transactions.length < 5}>
                <Forecast forecast={forecastData} />
            </ContentEntry>
            <ContentEntry fallbackMessage="Unable to generate Balance Chart" renderFallback={transactions.length < 1} label="Balance History">
                <BalanceChart transactions={transactions} />
            </ContentEntry>
            <ContentEntry fallbackMessage="Unable to generate Category Chart" renderFallback={categories.length < 1} label="Category Volume">
                <CategoriesChart categories={categories} />
            </ContentEntry>
            <ContentEntry fallbackMessage="Unable to render Transactions" renderFallback={transactions.length < 1} label="Recent Transactions">
                <div className="flex flex-col">
                    {transactions.slice(transactions.length - 5).reverse().map(function (transaction) {
                        return (
                            <div
                                key={transaction.id}
                                className="flex justify-between gap-2 border-y last:border-b-0 items-center first:border-t-0 border-stack p-2">
                                <div className="flex flex-col">
                                    <p> {transaction.name} </p>
                                    <p className="text-sm text-foreground/50"> {transaction.account.name} {"·"} {transaction.category.name} </p>
                                </div>
                                <b
                                    className="w-20 text-center h-min rounded-full border-2"
                                    style={{ borderColor: !transaction.received ? "#bf2f2f" : "#3bbf2f" }}>
                                    ${transaction.value.toFixed(2)}
                                </b>
                            </div>
                        )
                    })}
                </div>
            </ContentEntry>
            <ContentEntry fallbackMessage="Unable to render Accounts" renderFallback={accounts.length <= 1} label="Accounts">
                <div className="grid grid-cols-2 gap-2">
                    {accounts.map(async function (account) {

                        const volume = await getTotalAccountVolume({ accountId: account.id });

                        return (
                            <div
                                style={{ background: account.color }}
                                key={account.id}
                                className="border-2 border-stack p-2 flex justify-between gap-2 rounded-md">
                                <i> {account.name} </i>
                                <b> ${volume} </b>
                            </div>
                        )
                    })}
                </div>
            </ContentEntry>
            <ContentEntry
                renderFallback={false}
                fallbackMessage="Unable to render AI Chat Box"
                label="AI Chat Integration">
                <AIChatBox />
            </ContentEntry>
        </Screen>
    );

}

export default page;
import { database } from "@/src/configuration";
import { getAuth } from "@/src/server";
import { redirect } from "next/navigation";
import { Sorting, TransactionHistory } from "./components";
import { SORTING } from "./components/sorting";
import { constructSortingByParameter } from "./functions";

interface _props {
    searchParams: Promise<Readonly<{ sort: SORTING }>>;
}

async function page({ searchParams }: _props) {

    const auth = await getAuth();
    if (!auth) redirect("/");

    const { sort } = await searchParams;

    const ordering = await constructSortingByParameter({ sorting: sort });

    const transactions = await database.transaction.findMany({
        where: {
            user: {
                id: auth.id,
            }
        },
        include: {
            category: {
                select: {
                    name: true,
                }
            }
        },
        orderBy: ordering,
    });

    const parsedTransactions = transactions.map(function (transaction) {
        return { ...transaction, value: transaction.value.toNumber(), }
    });

    return (
        <div className="h-full flex flex-col gap-4">
            <Sorting activeSorting={sort} />
            <TransactionHistory transactions={parsedTransactions} />
        </div>
    );
}

export default page
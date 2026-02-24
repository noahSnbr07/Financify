import { database } from "@/src/configuration";
import { getAuth } from "@/src/server";
import { redirect } from "next/navigation";
import { TransactionHistory } from "./components";

async function page() {

    const auth = await getAuth();
    if (!auth) redirect("/");

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
        orderBy: {
            created: "desc",
        }
    });

    const parsedTransactions = transactions.map(function (transaction) {
        return { ...transaction, value: transaction.value.toNumber(), }
    });

    return (
        <TransactionHistory transactions={parsedTransactions} />
    );
}

export default page
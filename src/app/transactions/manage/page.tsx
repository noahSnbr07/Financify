import { database } from "@/src/configuration";
import { getAuth } from "@/src/server";
import { redirect } from "next/navigation";
import { ManageTransactions } from "./components";
import { UniversalTransaction } from "@/utils/universal-components/app-components";


async function page() {

    const auth = await getAuth();
    if (!auth) redirect("/authentication");

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
                    color: true,
                    id: true,
                }
            },
            account: {
                select: {
                    name: true,
                    color: true,
                    id: true,
                }
            },
        }
    });

    const parsedTransactions: UniversalTransaction[] = transactions.map(function (transaction) {
        return { ...transaction, value: Number(transaction.value), }
    });

    return (
        <div className="h-full flex flex-col gap-4">
            <ManageTransactions transactions={parsedTransactions} />
        </div>
    );
}

export default page;
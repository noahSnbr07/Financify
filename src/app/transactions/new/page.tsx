import { database } from "@/src/configuration";
import { CreateTransactionForm } from "./components";
import { getAuth } from "@/src/server";
import { redirect } from "next/navigation";

async function page() {

    const auth = await getAuth();
    if (!auth) redirect("/");

    const userConfig = { where: { user: { id: auth.id } } }

    const [categories, accounts] = await Promise.all([
        await database.category.findMany(userConfig),
        await database.account.findMany(userConfig),
    ]);

    return (
        <>
            <CreateTransactionForm
                accounts={accounts}
                categories={categories}
            />
        </>
    );
}

export default page;
import { database } from "@/src/configuration";
import { NewSubscriptionForm } from "./components";
import { getAuth } from "@/src/server";
import { redirect } from "next/navigation";

async function page() {

    const auth = await getAuth();
    if (!auth) redirect("/authentication");

    const query = {
        where: { userId: auth.id, }
    }

    const [categories, accounts] = await Promise.all([
        database.category.findMany(query),
        database.account.findMany(query),
    ]);

    return (
        <>
            <NewSubscriptionForm
                accounts={accounts}
                categories={categories}
            />
        </>
    );
}
export default page;
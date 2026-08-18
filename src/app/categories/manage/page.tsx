import { Screen } from "@/src/global/components";
import { CategoriesDestroyList, Links } from "../components";
import { database } from "@/src/configuration";
import { getAuth } from "@/src/server";
import { redirect } from "next/navigation";

async function page() {

    const auth = await getAuth();
    if (!auth) redirect("/");

    const categories = await database.category.findMany({ where: { userId: auth.id } })

    return (
        <Screen
            label="Manage Categories">
            <CategoriesDestroyList categories={categories} />
            <Links />
        </Screen>
    );
}
export default page
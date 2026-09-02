import { CategoriesDestroyList, Links } from "../components";
import { database } from "@/src/configuration";
import { getAuth } from "@/src/server";
import { redirect } from "next/navigation";

async function page() {

    const auth = await getAuth();
    if (!auth) redirect("/authentication");

    const categories = await database.category.findMany({ where: { userId: auth.id } })

    return (
        <>
            <CategoriesDestroyList categories={categories} />
            <Links />
        </>
    );
}
export default page
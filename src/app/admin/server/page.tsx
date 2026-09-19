import { getAdminState } from "@/src/server";
import getServerStats from "@/src/server/get-server-stats";
import { redirect, RedirectType } from "next/navigation";
import DataTable from "./components/data-table";

async function page() {

    const isAdmin = await getAdminState();
    if (!isAdmin) return redirect("/dashboard", RedirectType.replace);

    const metrics = await getServerStats();
    if (!metrics) redirect("/admin");


    return (
        <div
            className="flex flex-col gap-4"
        >
            <DataTable />
        </div>
    );
}

export default page;
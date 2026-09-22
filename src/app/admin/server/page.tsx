import { getAdminState } from "@/src/server";
import { redirect, RedirectType } from "next/navigation";
import DataTable from "./components/data-table";

async function page() {

    const isAdmin = await getAdminState();
    if (!isAdmin) return redirect("/dashboard", RedirectType.replace);

    return (
        <div
            className="flex flex-col gap-4"
        >
            <DataTable />
        </div>
    );
}

export default page;
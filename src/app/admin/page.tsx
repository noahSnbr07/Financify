import { getAdminState } from "@/src/server";
import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";

async function page() {

    const isAdmin = await getAdminState();
    if (!isAdmin) return redirect("/dashboard", RedirectType.replace);

    return (
        <div className="flex flex-col flex-1 gap-2 justify-center items-center">
            <Link
                href={"/dashboard"}
                className="px-8 py-2 rounded-sm font-bold bg-stack min-w-xs text-center">
                Dashboard
            </Link>            <Link
                href={"/admin/traffic"}
                className="px-8 py-2 rounded-sm font-bold bg-stack min-w-xs text-center">
                Traffic Monitor
            </Link>            <Link
                href={"/admin/community"}
                className="px-8 py-2 rounded-sm font-bold bg-stack min-w-xs text-center">
                Community
            </Link>            <Link
                href={"/admin/server"}
                className="px-8 py-2 rounded-sm font-bold bg-stack min-w-xs text-center">
                Server
            </Link>
        </div>
    );
}

export default page;
import { getAuth } from "@/src/server";
import { redirect } from "next/navigation";
import { CreateNewReport, ReportsList } from "./components";
import { database } from "@/src/configuration";
import Link from "next/link";

async function page() {

    const auth = await getAuth();
    if (!auth) redirect("/authentication");

    const reports = await database.report.findMany({ where: { user: { id: auth.id } } });

    return (
        <>
            <CreateNewReport />
            <hr className="w-full border-stack border-2 rounded-full" />
            <ReportsList reports={reports} />
            <hr className="w-full border-stack border-2 rounded-full" />
            <Link
                href={"/dashboard"}
                className="underline text-foreground/50 text-center">
                Dashboard
            </Link>
        </>
    );
}

export default page;
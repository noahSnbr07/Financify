import { UserRole } from "@/src/generated/prisma/enums";
import { getAuth } from "@/src/server";
import { redirect } from "next/navigation";
import getAdminFileData from "./get-admin-file-data";
import { FileList } from "./components";

async function page() {

    const auth = await getAuth();
    if (!auth || auth.role !== UserRole.admin) return redirect("/");

    const files = await getAdminFileData();

    return (
        <>
            <FileList files={files} />
        </>
    );
}


export default page;
import { database } from "@/src/configuration";
import { CommunityTable } from "./components";
import { getAuth } from "@/src/server";
import { UserRole } from "@/src/generated/prisma/enums";
import { redirect } from "next/navigation";

async function page() {

    const auth = await getAuth();
    if (!auth || auth.role !== UserRole.admin) return redirect("/admin")

    const users = await database.user.findMany({ omit: { hash: true } });

    return (
        <>
            <CommunityTable users={users} />
        </>
    );
}
export default page
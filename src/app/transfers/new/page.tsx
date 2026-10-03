import { getAuth } from "@/src/server";
import { CreateTransferForm } from "./components";
import { redirect } from "next/navigation";
import { database } from "@/src/configuration";
import { Warning } from "@/src/global/components";
import { warnings } from "@/src/static/client";

async function page() {
    const auth = await getAuth();
    if (!auth) redirect("/authentication");

    const accounts = await database.account.findMany({
        where: {
            user: {
                id: auth.id
            }
        }
    });

    return (
        <>
            {accounts.length < 2 && <Warning warning={warnings.TRANSFER_ACCOUNTS_INSUFFERABLE} />}
            {accounts.length >= 2 && (<CreateTransferForm accounts={accounts} />)}
        </>
    );
}
export default page
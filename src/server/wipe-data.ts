import { toast } from "react-toastify";
import { database } from "../configuration";
import getAuth from "./get-auth";

async function wipeData(): Promise<void> {

    const auth = await getAuth();
    if (!auth) throw new Error("Authentication failed");

    const selector = { where: { userId: auth.id }, };

    await Promise.all([
        database.transaction.deleteMany(selector),
        database.category.deleteMany(selector),
        database.account.deleteMany(selector),
        database.report.deleteMany(selector),
    ]).catch((error: Error) => {
        toast(error.message, { type: "error" });
        throw new Error(error.message);
    });
}

export default wipeData;
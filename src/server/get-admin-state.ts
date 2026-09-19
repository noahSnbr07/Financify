import { UserRole } from "../generated/prisma/enums";
import getAuth from "./get-auth";

async function getAdminState(): Promise<boolean> {

    const auth = await getAuth();
    if (!auth) return false;

    if (auth.role !== UserRole.admin) return false;

    else return true;
}

export default getAdminState;
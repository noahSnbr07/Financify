import { database } from "../configuration";
import getAuth from "./get-auth";


export default async function getBudget() {

    const auth = await getAuth();
    if (!auth) return 0;

    const user = await database.user.findUnique({ where: { id: auth.id } });

    return user && user.budget ? user?.budget : 0;


}
import { database } from "../configuration";
import { User } from "../interfaces";

export default async function getBudget({ auth }: { auth: User }) {

    const user = await database.user.findUnique({ where: { id: auth.id } });
    return user && user.budget ? user?.budget : 0;
}
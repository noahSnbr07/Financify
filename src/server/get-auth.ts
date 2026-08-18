import { cookies } from "next/headers";
import { User } from "../interfaces";
import { verify } from "jsonwebtoken";

async function getAuth(token?: string): Promise<User | null> {

    const secret = process.env.JWT_SECRET as string;
    const cookieStore = await cookies();
    const authToken = token || cookieStore.get("financify-token")!.value as string;

    if (!authToken) return null;

    try {

        const auth = verify(authToken, secret, { algorithms: ["HS256"] });
        return auth as unknown as User;

    } catch (error) {
        console.error(error);
        return null;
    }

}

export default getAuth;
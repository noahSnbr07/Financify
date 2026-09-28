"use server";

import { cookies } from "next/headers";
import { TOKEN_IDENTIFIERS, verifyAccessToken } from "@/utils/functions/auth-tools";
import { User } from "../interfaces";

async function getAuth(token?: string): Promise<User | null> {
    const cookieStore = await cookies();
    const authToken = token ?? cookieStore.get(TOKEN_IDENTIFIERS.ACCESS)?.value ?? null;

    return authToken ? verifyAccessToken(authToken) : null;
}

export default getAuth;
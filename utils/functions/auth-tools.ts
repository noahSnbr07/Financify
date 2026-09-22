import { database } from "@/src/configuration";
import { User } from "@/src/interfaces";
import { JsonWebTokenError, JwtPayload, sign, verify } from "jsonwebtoken";

export const TOKEN_IDENTIFIERS = {
    ACCESS: "financify-access-token",
    REFRESH: "financify-refresh-token",
} as const;

export const COOKIE_LIFETIME = 60 * 60 * 24 * 7;
export const ACCESS_TOKEN_EXPIRATION = "30m";
export const REFRESH_TOKEN_EXPIRATION = "7d";

export type AuthenticatedUser = Omit<User, "iat" | "exp">;
type VerifiedUser = AuthenticatedUser & Pick<User, "iat" | "exp">;

export interface RefreshedAuthentication {
    user: AuthenticatedUser;
    accessToken: string;
}

function getRequiredSecret(name: "JWT_SECRET" | "REFRESH_TOKEN_SECRET"): string {
    const secret = process.env[name];
    if (!secret) throw new Error(`${name} is not configured.`);
    return secret;
}

function isAuthenticatedUser(value: string | JwtPayload): value is JwtPayload & VerifiedUser {
    return Boolean(
        value &&
        typeof value === "object" &&
        typeof value.id === "string" &&
        typeof value.name === "string" &&
        typeof value.role === "string" &&
        typeof value.iat === "number" &&
        typeof value.exp === "number"
    );
}

export function createAccessToken(user: AuthenticatedUser): string {
    return sign(user, getRequiredSecret("JWT_SECRET"), {
        algorithm: "HS256",
        expiresIn: ACCESS_TOKEN_EXPIRATION,
    });
}

export function createRefreshToken(userId: string): string {
    return sign({ userId }, getRequiredSecret("REFRESH_TOKEN_SECRET"), {
        algorithm: "HS256",
        expiresIn: REFRESH_TOKEN_EXPIRATION,
    });
}

export function verifyAccessToken(token: string): User | null {
    try {
        const auth = verify(token, getRequiredSecret("JWT_SECRET"), { algorithms: ["HS256"] });
        return isAuthenticatedUser(auth) ? auth : null;
    } catch {
        return null;
    }
}

export async function refreshAuth(refreshToken: string): Promise<RefreshedAuthentication | null> {
    try {
        const decoded = verify(
            refreshToken,
            getRequiredSecret("REFRESH_TOKEN_SECRET"),
            { algorithms: ["HS256"] }
        ) as { userId?: string };

        if (!decoded.userId) return null;

        const userRecord = await database.user.findUnique({
            where: { id: decoded.userId },
            omit: { hash: true },
        });

        if (!userRecord) return null;

        return {
            user: userRecord,
            accessToken: createAccessToken(userRecord),
        };
    } catch (refreshError) {
        if (refreshError instanceof JsonWebTokenError) return null;
        console.error("Token refresh failed:", refreshError);
        return null;
    }
}

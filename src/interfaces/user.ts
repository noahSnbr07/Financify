import { UserRole } from "../generated/prisma/enums";

interface User {
    role: UserRole,
    name: string;
    id: string;
    created: Date;
    updated: Date;
    budget: number;
    avatar: string;
    iat: number;
    exp: number;
}

export default User;
interface User {
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

import { useEffect, useState } from "react";
import { APIResponseWithData, User } from "../interfaces";

export default function useAuth() {
    const [auth, setAuth] = useState<User | null>(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch("/api/authentication/get-state", {
                    method: "POST",
                    credentials: "include",
                });
                const data: APIResponseWithData<User | null> = await response.json();
                setAuth(data.data);
            } catch (error) {
                console.error("Failed to fetch auth state:", error);
                setAuth(null);
            }
        };

        getData();
    }, []); // Empty dependency array – run once on mount

    return auth;
}
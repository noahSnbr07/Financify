import { getAuth, getUserDatabaseStats } from "@/src/server";
import { Avatar, LogoutButton, MemberSince, UUIDDisplay } from "./components";
import { redirect } from "next/navigation";
import Statistics from "./components/statistics";
import Link from "next/link";

async function page() {

    const auth = await getAuth();
    if (!auth) redirect("/");

    const stats = await getUserDatabaseStats({ userId: auth.id });

    return (
        <>
            <Avatar
                name={auth.name}
                alt={auth.name}
                avatarHref={auth.avatar} />
            <Statistics
                totalAccounts={stats.totalAccounts}
                totalCategories={stats.totalCategories}
                totalTransactions={stats.totalTransactions} />
            <MemberSince
                created={auth.created} />
            <UUIDDisplay
                id={auth.id} />
            <LogoutButton />
            <Link
                href={"/dashboard"}
                className="underline text-foreground/50 text-center"> Go To Dashboard </Link>
        </>
    );
}

export default page;
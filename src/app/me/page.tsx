import { getAuth, getUserDatabaseStats } from "@/src/server";
import { Avatar, MemberSince, QRCode, UpdateAvatar, UpdateBudget, UUIDDisplay } from "./components";
import { redirect } from "next/navigation";
import Statistics from "./components/statistics";
import Link from "next/link";

async function page() {

    const auth = await getAuth();
    if (!auth) redirect("/authentication");

    const stats = await getUserDatabaseStats({ userId: auth.id });

    return (
        <>
            <Avatar
                name={auth.name}
                alt={auth.name}
                avatarHref={auth.avatar} />
            <Statistics
                totalReports={stats.totalReports}
                totalAccounts={stats.totalAccounts}
                totalCategories={stats.totalCategories}
                totalTransactions={stats.totalTransactions} />
            <UpdateAvatar />
            <UpdateBudget current={auth.budget} />
            <MemberSince
                created={auth.created} />
            <UUIDDisplay
                id={auth.id} />
            <QRCode />
            <Link
                href={"/dashboard"}
                className="underline text-foreground/50 text-center"> Go To Dashboard </Link>
        </>
    );
}

export default page;
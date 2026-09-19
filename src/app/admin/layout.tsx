import { ArrowUpDownIcon, LayoutDashboardIcon, ServerIcon, ShieldIcon, User2Icon } from "lucide-react";
import Link from "next/link";

interface _props {
    children: React.ReactNode;
}

async function layout({ children }: _props) {


    return (
        <div className="flex h-dvh w-dvw overflow-hidden">
            <Sidebar />
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <TopBar />

                <Content>
                    {children}
                </Content>
            </div>
        </div>
    );
}

export default layout;

function Sidebar() {
    return (
        <div
            className="border-r-4 items-center border-stack p-4 flex flex-col gap-4 min-w-3xs"
        >
            <b> Navigation </b>
            <div className="flex flex-col gap-2 w-full">
                <Link
                    href={"/admin/traffic"}
                    className="flex bg-stack rounded-sm gap-2 px-4 py-2">
                    <ArrowUpDownIcon size={20} opacity={.5} />
                    <p> Traffic Monitor </p>
                </Link>
                <Link
                    href={"/admin/community"}
                    className="flex bg-stack rounded-sm gap-2 px-4 py-2">
                    <User2Icon size={20} opacity={.5} />
                    <p> Community </p>
                </Link>
                <Link
                    href={"/admin/server"}
                    className="flex bg-stack rounded-sm gap-2 px-4 py-2">
                    <ServerIcon size={20} opacity={.5} />
                    <p> Server </p>
                </Link>
            </div>
        </div>
    );
}

function TopBar() {
    return (
        <div
            className="border-b-4 border-stack p-4 flex gap-4 justify-between"
        >
            <div className="flex gap-2 items-center">
                <ShieldIcon opacity={.5} size={20} />
                <b> Financify Admin Panel</b>
            </div>
            <Link
                href={"/dashboard"}
                className="bg-stack px-4 py-2 text-sm flex gap-2 rounded-lg items-center">
                <LayoutDashboardIcon size={16} opacity={.5} />
                <b> Dashboard </b>
            </Link>
        </div>
    );
}

function Content({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex-1 min-h-0 overflow-y-auto p-4 flex justify-center">
            <div className="flex flex-col gap-4 w-full max-w-7xl">{children}</div>
        </div>
    );
}
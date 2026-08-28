import { getAuth } from "@/src/server";
import Image from "next/image";
import Link from "next/link";
import PrivacyDigitsTogglerButton from "../client/privacy-digits-toggler-button";
import { ArrowLeftIcon } from "lucide-react";

interface _props {
    label: string;
    children: React.ReactNode;
}

async function Screen({ children, label }: _props) {

    const auth = await getAuth();

    return (
        <div className="flex flex-col size-full min-h-dvh">

            <header className="flex gap-4 p-4 items-center border-b-2 justify-between border-foreground/50">
                <div className="flex gap-4 items-center">                    <Link
                    href={"/dashboard"}
                    title="Dashboard">
                    <ArrowLeftIcon opacity={.5} />
                </Link>
                    <PrivacyDigitsTogglerButton />
                </div>
                <b> {label} </b>
                <Profile imageHref={`/api/resource/avatar/${auth?.avatar || "error.png"}`} name={auth?.name || "default"} />
            </header>

            <main className="flex-1 min-h-0 overflow-auto p-4 gap-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {children}
            </main>
        </div>
    );
}

export default Screen;

interface ProfileProps {
    name: string;
    imageHref: string;
}

function Profile({ imageHref, name }: ProfileProps) {

    return (
        <Link
            href={"/me"}
            title={name}
            className="size-8 relative">
            <Image
                width={32}
                height={32}
                alt={name}
                src={imageHref || "/error.png"}
                className="size-8 bg-stack rounded-full" />
            <div className="size-2 bg-green-500 bottom-0 right-0 absolute rounded-full"></div>
        </Link>
    );
}
import { SVGIcon } from "@/src/assets";
import Image from "next/image";
import Link from "next/link";

interface _props {
    label: string;
    children: React.ReactNode;
}

async function Screen({ children, label }: _props) {

    return (
        <div className="flex flex-col size-full min-h-dvh">

            <header className="flex gap-4 p-4 items-center border-b-2 justify-between border-foreground/50">
                <Image
                    src={SVGIcon}
                    height={32}
                    width={32}
                    alt="Logo"
                    title="Financify" />
                <b> {label} </b>
                <Profile imageHref="" name="user" />
            </header>

            <main className="flex-1 min-h-0 overflow-y-auto p-4 gap-4 flex flex-col xl:grid grid-cols-2">
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
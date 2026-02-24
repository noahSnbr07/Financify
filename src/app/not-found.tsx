import Image from "next/image";
import { construction } from "../assets";
import Link from "next/link";

async function NotFound() {

    return (
        <div className="flex flex-col justify-center items-center">
            <div
                className="h-dvh w-full max-w-xs flex flex-col justify-center items-center gap-8">
                <code className="text-xl font-bold border border-stack p-2 rounded-md w-full text-center"> 404 - Not Found </code>
                <i className="text-foreground/50"> This Page is still under Construction </i>
                <Image
                    className="rounded-md w-full"
                    alt="Construction"
                    title="Construction"
                    src={construction}
                />
                <Link
                    href={"/dashboard"}
                    className="bg-stack rounded-md w-full py-4 text-center font-bold">
                    Go To Dashboard
                </Link>
            </div>
        </div>
    );
}

export default NotFound;
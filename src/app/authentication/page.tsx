import { SVGIcon } from "@/src/assets";
import Image from "next/image";
import { AuthenticationForm } from "./components";

async function page() {

    return (
        <div className="h-dvh flex flex-col gap-8 p-4 justify-center items-center">
            <Image
                src={SVGIcon}
                height={128}
                width={128}
                alt="Logo"
                title="Logo" />
            <AuthenticationForm />
        </div>
    );
}

export default page;
import Link from "next/link";

async function Links() {


    return (
        <div className="flex flex-col gap-2">
            <Link
                href={"/categories/new"}
                className="underline w-full text-center text-foreground/50">
                Create New Category
            </Link>
            <Link
                href={"/dashboard"}
                className="underline w-full text-center text-foreground/50">
                Go to Dashboard
            </Link>
        </div>
    );
}
export default Links;
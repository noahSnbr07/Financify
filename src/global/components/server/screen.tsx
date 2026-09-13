import SidebarTogglerButton from "../client/sidebar-toggler-button";
import { Avatar } from "@/utils/components";

interface _props {
    label: string;
    children: React.ReactNode;
}

async function Screen({ children, label }: _props) {

    return (
        <div className="flex flex-col size-full min-h-dvh">

            <header className="flex gap-4 p-4 items-center border-b-2 justify-between border-foreground/50">
                <div className="flex gap-4 items-center">
                    <SidebarTogglerButton />
                </div>
                <b> {label} </b>
                <Avatar
                    size={32} />
            </header>

            <main className="flex-1 min-h-0 overflow-auto p-4 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {children}
            </main>
        </div>
    );
}

export default Screen;
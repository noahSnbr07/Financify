"use client";

import { SidebarContext } from "@/src/context";
import { useSidebarToggler } from "@/src/hooks";
import { SidebarClose, SidebarOpen } from "lucide-react";

export default function SidebarTogglerButton() {

    const sidebarToggler = useSidebarToggler();

    return (

        <SidebarContext.Provider value={sidebarToggler}>
            <button
                onClick={sidebarToggler?.toggle}
            >
                {sidebarToggler?.hidden ? <SidebarOpen opacity={.5} /> : <SidebarClose opacity={.5} />}
            </button>
        </SidebarContext.Provider>
    );
}
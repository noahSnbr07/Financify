"use client";

import * as React from "react";
import { useState } from "react";

interface SidebarProps {
    hidden: boolean;
    toggle: () => void;
}

export const SidebarContext = React.createContext<SidebarProps | undefined>(undefined);

export function SidebarToggler({ children }: { children: React.ReactNode }) {

    const [hidden, setHidden] = useState<boolean>(true);

    function toggle(): void {
        setHidden((previousValue: boolean) => !previousValue);
    }

    return (
        <SidebarContext.Provider
            value={{ hidden, toggle }}
        >
            {children}
        </SidebarContext.Provider>
    );
}
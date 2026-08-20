"use client";

import * as React from "react";
import { useState } from "react";

interface PrivacyDigitTogglerProps {
    hidden: boolean;
    toggle: () => void;
}

export const PrivacyDigitTogglerContext = React.createContext<PrivacyDigitTogglerProps | undefined>(undefined);

export function PrivacyDigitToggler({ children }: { children: React.ReactNode }) {

    const [hidden, setHidden] = useState<boolean>(false);

    function toggle(): void {
        setHidden((previousValue: boolean) => !previousValue);
    }

    return (
        <PrivacyDigitTogglerContext.Provider
            value={{ hidden, toggle }}
        >
            {children}
        </PrivacyDigitTogglerContext.Provider>
    );

}
"use client";

import { PrivacyDigitTogglerContext } from "@/src/context";
import { usePrivacyToggler } from "@/src/hooks";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function PrivacyDigitsTogglerButton() {

    const privacyDigitsToggler = usePrivacyToggler();

    return (

        <PrivacyDigitTogglerContext.Provider value={privacyDigitsToggler}>
            <button
                className=""
                onClick={privacyDigitsToggler?.toggle}
            >
                {privacyDigitsToggler?.hidden ? <EyeOffIcon opacity={.5} /> : <EyeIcon opacity={.5} />}
            </button>
        </PrivacyDigitTogglerContext.Provider>
    )
}
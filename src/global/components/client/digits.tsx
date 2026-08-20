'use client';

import { usePrivacyToggler } from "@/src/hooks";

interface _props {
    value: number | string;
    additionalClassName?: string;
    excludeCurrency?: boolean;
}

export default function Digits({ value, additionalClassName, excludeCurrency = false, }: _props) {

    const privacyDigitsToggler = usePrivacyToggler();
    const placeholder: string = "·····";

    return (
        <p className={additionalClassName || ""}>
            {!excludeCurrency && "$"}{privacyDigitsToggler?.hidden ? placeholder : value}
        </p>
    );
}
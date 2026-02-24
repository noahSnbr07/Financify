'use client';

import { colors } from "@/src/assets";
import { NewAccountProps } from "./new-account-form";
import { Dispatch, SetStateAction } from "react";

interface _props {
    newAccount: NewAccountProps;
    setNewAccount: Dispatch<SetStateAction<NewAccountProps>>;
}

export default function ColorPicker({ newAccount, setNewAccount }: _props) {

    function setActiveColor(color: string) {
        setNewAccount((previous) => ({ ...previous, color }));
    }

    return (
        <div className="flex flex-col gap-4 p-4 bg-stack rounded-lg">
            <b className="text-foreground/50 text-sm">
                Select New Account Color: {" "}
                <code
                    className="underline"
                    style={{ color: newAccount.color }}>
                    {newAccount.color}
                </code>
            </b>
            <div className="grid grid-cols-4 gap-4">
                {colors.map(function (color) {
                    return (
                        <button
                            key={color.id}
                            onClick={() => setActiveColor(color.hsl)}
                            style={{
                                background: color.hsl,
                                border: `4px solid ${color.hsl === newAccount.color ? "var(--foreground)" : "transparent"}`
                            }}
                            className="rounded-sm p-4 font-bold"
                        >
                            {color.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
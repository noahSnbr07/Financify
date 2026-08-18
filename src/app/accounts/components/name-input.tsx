'use client';

import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { NewAccountProps } from "./new-account-form";

interface _props {
    setNewAccount: Dispatch<SetStateAction<NewAccountProps>>;
}

export default function NameInput({ setNewAccount }: _props) {


    return (
        <div className="flex flex-col gap-4 p-4 bg-stack rounded-lg">
            <b className="text-foreground/50 text-bold text-sm"> Choose New Account Name </b>
            <input
                onChange={(event: ChangeEvent<HTMLInputElement>) => setNewAccount((previous) => ({ ...previous, name: event.target.value }))}
                autoFocus
                className="bg-stack p-4 rounded-sm"
                placeholder="name ..."
                type="text" />
        </div>
    );
}
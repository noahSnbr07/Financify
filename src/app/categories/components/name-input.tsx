'use client';

import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { NewCategoryProps } from "./new-category-form";

interface _props {
    setNewCategory: Dispatch<SetStateAction<NewCategoryProps>>;
}

export default function NameInput({ setNewCategory }: _props) {


    return (
        <div className="flex flex-col gap-4 p-4 bg-stack rounded-lg">
            <b className="text-foreground/50 text-bold text-sm"> Choose New Category Name </b>
            <input
                onChange={(event: ChangeEvent<HTMLInputElement>) => setNewCategory((previous) => ({ ...previous, name: event.target.value }))}
                autoFocus
                className="bg-stack p-4 rounded-sm"
                placeholder="name ..."
                type="text" />
        </div>
    );
}
'use client';

import { colors } from "@/src/assets";
import { useState } from "react";
import { SuccessAction, useFetch } from "@/src/hooks";
import { ColorSelector, StringInput } from "@/utils/form-components";

export interface NewCategoryProps {
    name: string;
    color: string;
}

export default function NewCategoryForm() {

    const [newCategory, setNewCategory] = useState<NewCategoryProps>({
        color: colors[0].hsl,
        name: "",
    });

    const { SubmitButton } = useFetch({
        feedback: {
            error: "Category could not be created",
            success: "Category has been created",
        },
        href: "/api/category/create",
        onSuccess: SuccessAction.redirect,
        redirectHref: "/dashboard",
        submitConditions: [
            newCategory.color.length > 0,
            newCategory.name.length > 0,
        ],
        data: newCategory
    })

    return (
        <div className="flex flex-col gap-4">
            <StringInput
                onChange={(name) => setNewCategory((previous) => ({ ...previous, name }))}
                value={newCategory.name}
                autoFocus
                placeholder="select name ..."
            />
            <ColorSelector
                color={newCategory.color}
                onChange={(color) => setNewCategory((previous) => ({ ...previous, color }))}
            />
            {SubmitButton}
        </div>
    );
}
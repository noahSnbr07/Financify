'use client';

import { colors } from "@/src/assets";

import { Dispatch, SetStateAction } from "react";
import { NewCategoryProps } from "./new-category-form";

interface _props {
    newCategory: NewCategoryProps;
    setNewCategory: Dispatch<SetStateAction<NewCategoryProps>>;
}

export default function ColorPicker({ newCategory, setNewCategory }: _props) {

    function setActiveColor(color: string) {
        setNewCategory((previous) => ({ ...previous, color }));
    }

    return (
        <div className="flex flex-col gap-4 p-4 bg-stack rounded-lg">
            <b className="text-foreground/50 text-sm">
                Select New Category Color: {" "}
                <code
                    className="underline"
                    style={{ color: newCategory.color }}>
                    {newCategory.color}
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
                                border: `4px solid ${color.hsl === newCategory.color ? "var(--foreground)" : "transparent"}`
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
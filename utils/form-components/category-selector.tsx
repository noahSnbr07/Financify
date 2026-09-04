'use client';

import { Category } from "@/src/generated/prisma/client";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import FormStateIndicator from "./form-state-indicator";

interface _props {
    onChange: (category: Category) => void;
    category: Category;
    categories: Category[];
}
export default function CategorySelector({ categories, category, onChange }: _props) {

    return (
        <div className="flex flex-col gap-4 p-4 bg-stack rounded-lg">
            <FormStateIndicator color={category.color} label="Select Category:" value={category.name} />

            <div className="grid grid-cols-2 gap-4">
                {categories.map(function (indexedCategory) {
                    return (
                        <button
                            key={indexedCategory.id}
                            type="button"
                            className="rounded-sm p-2 font-bold"
                            style={
                                {
                                    border: `4px solid ${indexedCategory.color}`,
                                    background: category.id === indexedCategory.id ? `${indexedCategory.color}` : "var(--stack)"
                                }}
                            onClick={() => onChange(indexedCategory)}> {indexedCategory.name} </button>
                    );
                })}
                <Link
                    className="bg-stack rounded-sm flex justify-center p-2 border-foreground/50 border-2"
                    href={"/categories/new"}
                > <PlusIcon opacity={.5} /> </Link>
            </div>
        </div>
    );
}
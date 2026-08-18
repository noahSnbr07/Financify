'use client';
import { Category } from "@/src/generated/prisma/client";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import DeleteModal from "./delete-modal";

interface _props {
    categories: Category[];
}

export default function CategoriesDestroyList({ categories }: _props) {

    const [modal, setModal] = useState<boolean>(false);
    const [pickedCategoryId, setPickedCategoryId] = useState<string>("");

    function runModal(categoryId: string) {
        setPickedCategoryId(categoryId)
        setModal(true);
    }

    return (
        <div className="flex flex-col gap-2 items-center">
            {modal && <DeleteModal
                setPickedCategoryId={setPickedCategoryId}
                setModal={setModal}
                categoryId={pickedCategoryId}
            />}
            <p className="bg-stack py-2 w-full rounded-lg text-center"> categories: {categories.length} </p>
            <div className="flex flex-col w-full gap-2">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="flex p-2 gap-2 bg-stack rounded-lg items-center justify-between">
                        <div className="flex pl-2 gap-4 items-center">
                            <div
                                style={{
                                    background: category.color,
                                    height: "32px",
                                    width: "32px",
                                    borderRadius: "4px",
                                }}
                            ></div>
                            <b> {category.name} </b>
                        </div>
                        <button
                            disabled={modal}
                            style={{
                                opacity: modal ? .5 : 1
                            }}
                            onClick={() => runModal(category.id)}
                            className="bg-red-400 px-4 py-2 rounded-sm grid place-content-center"
                        >
                            <TrashIcon size={24} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
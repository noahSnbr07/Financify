'use client';

import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";

interface _props {
    categoryId: string;
    setModal: Dispatch<SetStateAction<boolean>>;
    setPickedCategoryId: Dispatch<SetStateAction<string>>;
}

export default function DeleteModal({ categoryId, setModal, setPickedCategoryId }: _props) {

    const router = useRouter();
    const [pending, setPending] = useState<boolean>(false);

    async function deleteCategory(categoryId: string): Promise<void> {
        setPending(true);

        try {
            const requestBody = JSON.stringify({ categoryId });
            await fetch(`/api/category/delete`, { body: requestBody, method: "POST" });
            toast("Category has been deleted", { type: "success" });
        } catch (error) {
            console.error(error);
            toast("Category could not be deleted", { type: "error" });
        } finally {
            setPickedCategoryId("");
            setPending(false);
            setModal(false);
        }
        router.refresh();
    }

    function aboardDeletion() {
        setPickedCategoryId("");
        setModal(false);
    }

    return (
        <div
            style={{
                backgroundColor: "rgba(0, 0, 0, .5)",
            }}
            className="fixed h-full w-full px-8 z-10 grid place-content-center"
        >
            <div className="bg-stack flex flex-col items-center gap-4 p-4 rounded-xl">
                <p> Deleting this Category will also forcefully remove its attached Transactions. </p>
                <div className="flex justify-between w-full">
                    <button onClick={aboardDeletion} className="py-2 font-bold px-8 rounded-sm bg-stack"> Aboard </button>
                    <button
                        disabled={pending}
                        style={{ opacity: pending ? .1 : 1 }}
                        onClick={() => deleteCategory(categoryId)} className="py-2 font-bold px-8 rounded-sm bg-red-400"> Delete </button>
                </div>
            </div>
        </div>
    );
}
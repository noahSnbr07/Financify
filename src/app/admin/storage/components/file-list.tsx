'use client';

import { formatBytes } from "@/utils/functions/formatters";
import { GetFiles } from "../get-admin-file-data";

interface _props {
    files: GetFiles;
}

export default function FileList({ files }: _props) {


    return (
        <div className="flex flex-col gap-2 rounded-lg bg-stack text-lg">
            <div className="bg-stack rounded-lg p-4 grid gap-4 grid-cols-5 font-bold">
                <p> UUID </p>
                <p> Name </p>
                <p> Size </p>
                <p> userId </p>
                <p> created </p>
            </div>
            <div className="flex flex-col overflow-y-scroll min-h-16">
                {files.length < 1 ? <p className="w-full text-center m-4"> No Files </p> : (
                    <>
                        {files.map((file) => (
                            <div
                                className="grid text-sm grid-cols-5 gap-4 p-4"
                                key={file.id}
                            >
                                <p> {file.id} </p>
                                <p> {`${file.name}`} </p>
                                <p> {formatBytes(file.size)} </p>
                                <p> {file.userId} </p>
                                <p> {file.created.toLocaleString()} </p>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}
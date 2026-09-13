'use client';
import { File } from "@/src/generated/prisma/client";
import { FileType } from "@/src/generated/prisma/enums";
import { FileIcon } from "lucide-react";
import Link from "next/link";

interface _props {
    reports: File[]
}
export default function ReportsList({ reports }: _props) {

    return (
        <div className="flex flex-col gap-2 flex-1 overflow-y-scroll">
            {reports.map((report) => (
                <Link
                    key={report.id}
                    href={`/api/resource/download?name=${encodeURIComponent(report.name)}&type=${FileType.REPORT}`}
                    className="bg-stack rounded-lg p-4 gap-4 flex cursor-pointer">
                    <div className="bg-stack rounded-sm p-2 aspect-square h-min">
                        <FileIcon size={24} opacity={.5} />
                    </div>
                    <div className="flex flex-col">
                        <b className="truncate w-48"> {report.name} </b>
                        <i className="text-sm text-foreground/50">  {report.created.toLocaleString()} </i>
                    </div>
                </Link>
            ))}
        </div>
    );
}
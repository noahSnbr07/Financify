'use client';
import { Report } from "@/src/generated/prisma/client";
import { FileIcon } from "lucide-react";
import Link from "next/link";

interface _props {
    reports: Report[];
}
export default function ReportsList({ reports }: _props) {


    return (
        <div className="flex flex-col gap-2 flex-1 overflow-y-scroll">
            {reports.map((report) => (
                <Link
                    key={report.id}
                    href={`/api/report/download/${report.filename}.json`}
                    className="bg-stack rounded-lg p-4 gap-4 flex cursor-pointer">
                    <div className="bg-stack rounded-sm p-2">
                        <FileIcon size={24} opacity={.5} />
                    </div>
                    <div className="flex flex-col">
                        <b> {report.filename}.json </b>
                        <i className="text-sm text-foreground/50">  {report.created.toLocaleString()} </i>
                    </div>
                </Link>
            ))}
        </div>
    );
}
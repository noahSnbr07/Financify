import { database } from "@/src/configuration";
import { FileType } from "@/src/generated/prisma/enums";
import { getAuth } from "@/src/server";
import { apiResponsePresets } from "@/src/static";
import { getStorageSubPath } from "@/utils/api";
import { existsSync, readFileSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { join, resolve } from "path";

async function downloadFile(name: string, type: FileType): Promise<NextResponse> {
    try {
        const auth = await getAuth();

        if (!auth) {
            return NextResponse.json(apiResponsePresets.UNAUTHORIZED(), { status: 401 });
        }

        if (!name || name.trim().length === 0) return NextResponse.json(apiResponsePresets.BAD_REQUEST({ message: "Filename is required" }), { status: 400 });
        if (!type || !Object.values(FileType).includes(type)) return NextResponse.json(apiResponsePresets.BAD_REQUEST({ message: "Invalid file type" }), { status: 400 });


        const query = {
            name: name.trim(),
            userId: auth.id,
            type,
        };

        const file = await database.file.findUnique({ where: query });

        if (!file) {
            return NextResponse.json(
                apiResponsePresets.NOT_FOUND({ message: "File not found" })
                , { status: 404 });
        }

        const subPath = await getStorageSubPath(type);
        const filePath = join(process.cwd(), "data", subPath, name.trim());
        const allowedBaseDir = resolve(join(process.cwd(), "data"));
        const resolvedPath = resolve(filePath);

        if (!resolvedPath.startsWith(allowedBaseDir)) {
            console.warn(`Path traversal attempt detected: ${resolvedPath}`);
            return NextResponse.json(
                apiResponsePresets.BAD_REQUEST({ message: "Invalid file path" })
            );
        }

        if (!existsSync(resolvedPath)) {
            console.error(`File not found on disk: ${resolvedPath}`);
            return NextResponse.json(
                apiResponsePresets.NOT_FOUND({ message: "File not found on disk" })
                , { status: 404 });
        }

        const fileBuffer = readFileSync(resolvedPath);

        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                "Content-Type": file.mime
                    ? `${file.mime}/${file.extension}`
                    : "application/octet-stream",
                "Content-Disposition": `attachment; filename="${name.trim()}"`,
                "Cache-Control": "public, max-age=3600",
            },
        });
    } catch (error) {
        console.error("File download error:", error);
        return NextResponse.json(
            apiResponsePresets.INTERNAL_SERVER_ERROR({
                error: error instanceof Error ? error.message : "Unknown error",
            }),
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
    const name = request.nextUrl.searchParams.get("name") ?? "";
    const type = request.nextUrl.searchParams.get("type") as FileType;

    return downloadFile(name, type);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    const body = await request.json();
    const { name, type }: { name: string; type: FileType } = body;

    return downloadFile(name, type);
}
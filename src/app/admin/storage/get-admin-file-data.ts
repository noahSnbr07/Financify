import { database } from "@/src/configuration";
import { File } from "@/src/generated/prisma/client";
import { UserRole } from "@/src/generated/prisma/enums";
import { getAuth } from "@/src/server";

export type GetFiles = Pick<File, "name" | "created" | "id" | "isPublic" | "size" | "url" | "userId" | "extension">[];

async function getAdminFileData(): Promise<GetFiles> {

    const auth = await getAuth();
    if (!auth || auth.role !== UserRole.admin) return [];

    try {

        const files: GetFiles = await database.file.findMany({
            select: {
                name: true,
                size: true,
                created: true,
                id: true,
                userId: true,
                url: true,
                isPublic: true,
                extension: true,
            }
        });

        if (!files || files.length < 1) return [];

        return files;

    } catch (error) {
        console.error(error);
        return [];
    }

}
export default getAdminFileData
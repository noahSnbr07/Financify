import { database } from '@/src/configuration';
import { FileExtension, FileMime, FileType } from '@/src/generated/prisma/enums';
import { getFileName, getStandardizedFile, getStorageSubPath } from '@/utils/api';
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';

interface UploadFileOptions {
    file: File;
    type: FileType;
    extension: FileExtension;
    mime: FileMime;
    userId: string;
}

export default async function uploadFile({ file, type, extension, mime, userId }: UploadFileOptions) {
    const { buffer, size } = await getStandardizedFile(file, type);
    const name = await getFileName(extension, type);
    const subPath = await getStorageSubPath(type);
    const url = join(process.cwd(), 'data', subPath, name);

    mkdirSync(dirname(url), { recursive: true });
    writeFileSync(url, buffer);

    return database.file.create({
        data: {
            extension,
            mime,
            type,
            name,
            url,
            size,
            isPublic: false,
            userId,
        },
    });
}
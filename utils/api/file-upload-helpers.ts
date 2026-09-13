import { FileExtension, FileType } from '@/src/generated/prisma/enums';
import sharp from 'sharp';
import { v4 } from 'uuid';

export async function getStorageSubPath(fileType: FileType): Promise<string> {
    const pathMap: Record<FileType, string> = {
        [FileType.AVATAR]: 'avatars',
        [FileType.REPORT]: 'reports',
        [FileType.SNAPSHOT]: 'snapshots',
    };
    return pathMap[fileType] || 'other';
}

export async function getFileName(extension: FileExtension, type: FileType): Promise<string> {
    const uuid = v4();
    return `${type.toLowerCase()}_${uuid}.${extension}`;
}

export async function getStandardizedFile(file: File, type: FileType): Promise<{ size: number; buffer: Buffer }> {

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (type !== FileType.AVATAR) {
        return {
            buffer,
            size: buffer.byteLength,
        };
    }

    const image = sharp(buffer).resize({
        height: 256,
        width: 256,
        background: '#101010',
        fit: 'contain',
    }).jpeg({ quality: 100 });

    const processedBuffer = await image.toBuffer();

    return {
        buffer: processedBuffer,
        size: processedBuffer.byteLength,
    };
}

const mimeTypeMap: Record<FileExtension, string> = {
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    png: 'image/png',
    json: 'application/json',
    svg: 'image/svg+xml',
};

export async function getMimeType(extension: FileExtension): Promise<string> {
    return mimeTypeMap[extension] || 'application/octet-stream';
}
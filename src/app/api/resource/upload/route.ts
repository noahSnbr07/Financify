import { FileExtension, FileMime, FileType } from '@/src/generated/prisma/enums';
import { getAuth, uploadFile } from '@/src/server';
import { apiResponsePresets } from '@/src/static';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(_request: NextRequest): Promise<NextResponse> {
    const auth = await getAuth();
    if (!auth?.id) return NextResponse.json(apiResponsePresets.UNAUTHORIZED(), { status: 401 });

    const maxFileSize = Number(process.env.MAX_FILE_SIZE || 1024 * 1024 * 5);

    const formData = await _request.formData();

    const type = formData.get('type') as FileType;
    const extension = formData.get('extension') as FileExtension;
    const mime = formData.get('mime') as FileMime;
    const file = formData.get('file') as File;

    if (!extension || !mime || !type || !file) {
        return NextResponse.json(
            apiResponsePresets.BAD_REQUEST({ message: 'Request Body Invalid' }),
            { status: 400 }
        );
    }

    try {
        if (file.size > maxFileSize) {
            return NextResponse.json(
                apiResponsePresets.BAD_REQUEST({ message: 'File Size Limit: 5mb' }),
                { status: 400 }
            );
        }

        const uploadedFile = await uploadFile({ file, type, extension, mime, userId: auth.id });

        return NextResponse.json({
            ...apiResponsePresets.CREATED({ message: "File has been uploaded" }),
            data: { name: uploadedFile.name },
        });
    } catch (error) {
        console.error('[FILE_UPLOAD_ERROR]', error);
        if (error instanceof Error) {
            return NextResponse.json(
                apiResponsePresets.INTERNAL_SERVER_ERROR({ error: error.message }),
                { status: 500 }
            );
        }
        return NextResponse.json(
            apiResponsePresets.INTERNAL_SERVER_ERROR({ error: 'Unknown error' }),
            { status: 500 }
        );
    }
}
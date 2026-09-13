import { database } from '@/src/configuration';
import { FileExtension, FileMime, FileType } from '@/src/generated/prisma/enums';
import { APIResponse } from '@/src/interfaces';
import { getAuth, uploadFile } from '@/src/server';
import { apiResponsePresets } from '@/src/static';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(_request: NextRequest): Promise<NextResponse<APIResponse>> {

    const auth = await getAuth();
    if (!auth) return NextResponse.json(apiResponsePresets.UNAUTHORIZED(), { status: 401 });

    const formData = await _request.formData();
    const file = formData.get("avatar") as File;

    if (!file) return NextResponse.json(apiResponsePresets.BAD_REQUEST({ message: "File not found." }), { status: 400 });

    try {

        const uploadedFile = await uploadFile({
            file,
            type: FileType.AVATAR,
            extension: FileExtension.jpeg,
            mime: FileMime.image,
            userId: auth.id,
        });

        await database.user.update({
            where: { id: auth.id, },
            data: { avatar: uploadedFile.name },
            omit: { hash: true }
        });

        return NextResponse.json(apiResponsePresets.OK({ message: "Avatar updated." }))

    } catch (error) {
        console.error(error);
        if (error instanceof Error) return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: error.message }));
        else return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: "Uncaught server error." }))
    }

}
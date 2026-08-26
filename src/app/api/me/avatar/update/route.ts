import { database } from '@/src/configuration';
import { APIResponse } from '@/src/interfaces';
import { getAuth } from '@/src/server';
import { apiResponsePresets } from '@/src/static';
import { mkdirSync, writeFileSync } from 'fs';
import { NextResponse, NextRequest } from 'next/server';
import { join } from 'path';
import sharp from 'sharp';
import { v4 } from 'uuid';

export async function POST(_request: NextRequest): Promise<NextResponse<APIResponse>> {

    const auth = await getAuth();
    if (!auth) return NextResponse.json(apiResponsePresets.UNAUTHORIZED());

    const formData = await _request.formData();
    const file = formData.get("avatar") as File;

    if (!file) return NextResponse.json(apiResponsePresets.NOT_FOUND({ message: "File not found." }));

    try {

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const identifier = `${v4()}.jpeg`;

        const standardizedFile = sharp(buffer)
            .resize({ height: 256, width: 256, fit: "contain", background: "#101010" })
            .jpeg({ quality: 100 });

        mkdirSync(join(process.cwd(), 'data/avatars'), { recursive: true });

        //construct the absolute path to thr requested file
        const filePath = join(process.cwd(), 'data/avatars', identifier);

        writeFileSync(filePath, Buffer.from(await standardizedFile.toBuffer()));

        await database.user.update({
            where: { id: auth.id, },
            data: { avatar: identifier },
            omit: { hash: true }
        });

        return NextResponse.json(apiResponsePresets.OK({ message: "Avatar updated." }))

    } catch (error) {
        console.error(error);
        if (error instanceof Error) return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: error.message }));
        else return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: "Uncaught server error." }))
    }

}
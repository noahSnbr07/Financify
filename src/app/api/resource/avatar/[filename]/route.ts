import { NextResponse, NextRequest } from 'next/server';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';

type Params = Promise<{ filename: string }>

export async function GET(_request: NextRequest, segmentData: { params: Params }) {

    //extract the requested file
    const { filename } = await segmentData.params;

    //construct the absolute path to thr requested file
    const filePath = join(process.cwd(), 'data/avatars', filename);

    try {

        if (!existsSync(filePath)) {
            return new NextResponse('Image not found', {
                status: 404,
                headers: {
                    'Content-Type': 'text/plain',
                },
            });
        }

        //read/retrieve the file
        const file = readFileSync(filePath);

        //serve the file
        return new NextResponse(file, {
            status: 200,
            headers: {
                'Content-Type': 'image/*',
            },
        });
    } catch (error) {
        console.error(error);
        return new NextResponse("/error.png", {
            headers: {
                'Content-Type': 'image/*',
            },
        });
    }
}

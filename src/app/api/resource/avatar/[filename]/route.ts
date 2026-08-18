import { NextResponse, NextRequest } from 'next/server';
import { join } from 'path';
import { readFileSync } from 'fs';

type Params = Promise<{ filename: string }>

export async function GET(_request: NextRequest, segmentData: { params: Params }) {

    //extract the requested file
    const { filename } = await segmentData.params;

    //construct the absolute path to thr requested file
    const filePath = join(process.cwd(), 'data/avatars', filename);

    try {
        //read/retrieve the file
        const file = readFileSync(filePath);

        //serve the file
        return new NextResponse(file, {
            headers: {
                'Content-Type': 'image/*',
            },
        });
    } catch (error) {
        console.error(error);
        return new NextResponse('File not found', { status: 404 });
    }
}

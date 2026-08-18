'use client';

import { useEffect, useState } from 'react';
import { toDataURL } from 'qrcode';
import Image from 'next/image';

export default function QRCode() {

    const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

    useEffect(() => {
        const url = window.location.origin;
        toDataURL(url, { width: 256, color: { dark: "#101010" }, margin: 2, type: "image/webp" }).then((data) => setQrDataUrl(data));
    }, []);

    if (!qrDataUrl) return null;

    return (
        <div className='p-4 bg-stack rounded-lg flex flex-col gap-4 items-center'>
            <b> Share Financify </b>
            <Image
                height={0}
                width={0}
                alt='qr code'
                title='qr code'
                className='w-full rounded-sm '
                unoptimized
                src={qrDataUrl}
            />
        </div>
    );
}
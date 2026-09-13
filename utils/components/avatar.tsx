'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { FileType } from '@/src/generated/prisma/enums';
import { useAuth } from '@/src/hooks';

interface _props {
    size: number;
    props?: ImageProps;
}

export default function Avatar({ size, props }: _props) {
    const [imageSrc, setImageSrc] = useState<string>('/error.png');
    const auth = useAuth();

    useEffect(() => {
        if (!auth?.avatar) return;

        let blobUrl: string | null = null;

        const fetchImage = async () => {
            try {
                const response = await fetch('/api/resource/download', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'image/*',
                    },
                    body: JSON.stringify({
                        type: FileType.AVATAR,
                        name: auth.avatar,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(
                        errorData.message || `Failed to fetch image: ${response.statusText}`
                    );
                }

                const blob = await response.blob();
                blobUrl = URL.createObjectURL(blob);
                setImageSrc(blobUrl);
            } catch (err) {
                console.error('Image fetch error:', err);
                setImageSrc('/error.png');
                if (blobUrl) URL.revokeObjectURL(blobUrl);
            }
        };

        fetchImage();

        return () => {
            if (blobUrl) URL.revokeObjectURL(blobUrl);
        };
    }, [auth?.avatar]);

    return (
        <Image
            alt="Avatar"
            height={size}
            width={size}
            className="bg-stack rounded-full object-cover"
            src={imageSrc}
            onError={() => setImageSrc('/error.png')}
            priority={false}
            {...props}
        />
    );
}
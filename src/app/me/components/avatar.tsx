'use client';

import Image from "next/image";

interface _props {
    avatarHref: string;
    alt: string;
    name: string;
}

export default function Avatar({ avatarHref, alt, name }: _props) {

    return (
        <div
            className="flex gap-4 items-center w-full bg-stack rounded-lg p-4"
        >
            <Image
                width={64}
                height={64}
                className="bg-stack rounded-full"
                src={`/api/resource/avatar/${avatarHref}` || "default.png"}
                alt={alt}
                title={alt} />
            <b className="text-xl"> {name} </b>
        </div>
    );
}
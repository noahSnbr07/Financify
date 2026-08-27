'use client';

import { generating, yapping } from "@/src/assets";
import Image from "next/image";

interface _props {
    thinking: boolean;
}

export default function Avatar({ thinking }: _props) {


    return (
        <div className="flex flex-col gap-4 items-center">
            <Image
                alt="Fluffle"
                src={thinking ? generating : yapping}
                height={192}
                className="rounded-full p-4 bg-stack aspect-square" />
            <b className="text-xl bg-stack rounded-lg px-8 py-1"> Fluffle </b>
        </div>
    );
}
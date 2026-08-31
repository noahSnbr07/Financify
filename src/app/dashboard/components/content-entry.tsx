'use client';

import { InfoIcon } from "lucide-react";
import { motion } from "framer-motion";

interface _props {
    children: React.ReactNode;
    label: string;
    renderFallback: boolean;
    index: number;
}

export default function ContentEntry({ children, label, renderFallback, index }: _props) {

    return (
        <motion.div
            transition={{ delay: index * .25 }}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -32 }}
            className="bg-stack rounded-xl p-2 flex flex-col min-h-24 gap-2">
            {renderFallback ? <FallBackContent /> : <DefaultContent label={label}> {children} </DefaultContent>}
        </motion.div>
    );
}

interface DefaultContentProps {
    children: React.ReactNode;
    label: string;
}

function DefaultContent({ children, label }: DefaultContentProps) {

    return (
        <>
            <b className="text-foreground/50 text-center"> {label} </b>
            <div className="flex-1"> {children} </div>
        </>
    );
}

function FallBackContent() {

    return (
        <div className="flex justify-center items-center w-full min-h-64 flex-col gap-2">
            <InfoIcon size={32} opacity={.25} />
            <i className="text-foreground/50"> {"not enough data collected yet ..."} </i>
        </div>
    )
}
import Screen from "@/src/global/components/server/screen";
import React from "react";

interface _props {
    children: React.ReactNode;
}

async function layout({ children }: _props) {


    return (
        <Screen label="Reports">
            {children}
        </Screen>
    );
}
export default layout
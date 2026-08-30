"use client";

import React from "react";
import { SidebarContext } from "../context"

export default function useSidebarToggler() {

    const context = React.useContext(SidebarContext);

    if (!context) console.error("Context Consumer must be used within Provider");

    else return context;

}
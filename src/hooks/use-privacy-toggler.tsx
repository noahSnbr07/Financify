"use client";

import React from "react";
import { PrivacyDigitTogglerContext } from "../context";

export default function usePrivacyToggler() {

    const context = React.useContext(PrivacyDigitTogglerContext);

    if (!context) console.error("Context Consumer must be used within Provider");

    else return context;

}
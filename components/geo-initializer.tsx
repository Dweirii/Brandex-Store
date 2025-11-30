"use client";

import { useEffect } from "react";
import { useGeo } from "@/hooks/use-geo";

export const GeoInitializer = () => {
    const { autoDetect } = useGeo();

    useEffect(() => {
        autoDetect();
    }, [autoDetect]);

    return null;
};

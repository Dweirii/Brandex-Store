"use client";

import React, { useEffect, useState } from "react";

const ChristmasDecorations = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Generate snowflakes with random properties
    const snowflakes = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 10 + 10}s`,
        animationDelay: `${Math.random() * 20}s`,
        fontSize: `${Math.random() * 10 + 10}px`,
        opacity: Math.random() * 0.7 + 0.3,
    }));

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            {/* Snowflakes */}
            {snowflakes.map((snow) => (
                <div
                    key={snow.id}
                    className="snowflake"
                    style={{
                        left: snow.left,
                        animationDuration: snow.animationDuration,
                        animationDelay: snow.animationDelay,
                        fontSize: snow.fontSize,
                        opacity: snow.opacity,
                    }}
                >
                    ❄
                </div>
            ))}
        </div>
    );
};

export default ChristmasDecorations;

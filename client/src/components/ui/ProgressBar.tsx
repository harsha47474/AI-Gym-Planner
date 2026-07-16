import React from "react";

interface ProgressBarProps {
    progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
    return (
        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div
                className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500 ease-in-out"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    )
}
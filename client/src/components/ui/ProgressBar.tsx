import React from "react";
import clsx from "clsx";

interface ProgressBarProps {
    progress: number;
    label?: string;
    showPercent?: boolean;
    size?: "sm" | "md" | "lg";
    color?: "red" | "green" | "blue";
    className?: string;
}

export default function ProgressBar({
    progress,
    label,
    showPercent = false,
    size = "md",
    color = "red",
    className,
}: ProgressBarProps) {
    const heights: Record<string, string> = { sm: "h-1", md: "h-2", lg: "h-3" };
    const gradients: Record<string, string> = {
        red: "from-red-500 to-red-400",
        green: "from-green-500 to-green-400",
        blue: "from-blue-500 to-blue-400",
    };

    return (
        <div className={clsx("w-full", className)}>
            {(label || showPercent) && (
                <div className="flex justify-between items-center mb-1.5">
                    {label && <span className="text-xs text-muted font-medium">{label}</span>}
                    {showPercent && <span className="text-xs text-muted">{Math.round(progress)}%</span>}
                </div>
            )}
            <div className={clsx("w-full rounded-full bg-white/10 overflow-hidden", heights[size])}>
                <div
                    className={clsx(
                        "h-full bg-gradient-to-r transition-all duration-500 ease-in-out rounded-full",
                        gradients[color]
                    )}
                    style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                />
            </div>
        </div>
    );
}
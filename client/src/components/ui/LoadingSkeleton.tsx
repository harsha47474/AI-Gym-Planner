import React from "react";
import clsx from "clsx";

interface LoadingSkeletonProps {
    className?: string;
    lines?: number;
    variant?: "card" | "text" | "circle" | "stat";
}

function SkeletonBlock({ className }: { className?: string }) {
    return (
        <div className={clsx(
            "animate-pulse rounded-lg bg-white/5",
            className
        )} />
    );
}

export function StatSkeleton() {
    return (
        <div className="glass rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <SkeletonBlock className="h-3 w-20" />
                <SkeletonBlock className="h-9 w-9 rounded-xl" />
            </div>
            <SkeletonBlock className="h-7 w-16" />
            <SkeletonBlock className="h-3 w-24" />
        </div>
    );
}

export function CardSkeleton({ lines = 3 }: { lines?: number }) {
    return (
        <div className="glass rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
                <SkeletonBlock className="h-10 w-10 rounded-xl" />
                <div className="space-y-2 flex-1">
                    <SkeletonBlock className="h-4 w-32" />
                    <SkeletonBlock className="h-3 w-20" />
                </div>
            </div>
            {Array.from({ length: lines }).map((_, i) => (
                <SkeletonBlock key={i} className={clsx("h-3", i === lines - 1 ? "w-2/3" : "w-full")} />
            ))}
        </div>
    );
}

export function ExerciseCardSkeleton() {
    return (
        <div className="glass rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
                <SkeletonBlock className="h-5 w-48" />
                <SkeletonBlock className="h-6 w-12 rounded-full" />
            </div>
            <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-1">
                        <SkeletonBlock className="h-3 w-10" />
                        <SkeletonBlock className="h-5 w-8" />
                    </div>
                ))}
            </div>
            <SkeletonBlock className="h-3 w-full" />
        </div>
    );
}

export default function LoadingSkeleton({ className, lines = 3, variant = "card" }: LoadingSkeletonProps) {
    if (variant === "stat") return <StatSkeleton />;
    if (variant === "card") return <CardSkeleton lines={lines} />;
    if (variant === "circle") return <SkeletonBlock className={clsx("rounded-full", className)} />;
    return (
        <div className={clsx("space-y-2", className)}>
            {Array.from({ length: lines }).map((_, i) => (
                <SkeletonBlock key={i} className={clsx("h-3", i === lines - 1 ? "w-2/3" : "w-full")} />
            ))}
        </div>
    );
}

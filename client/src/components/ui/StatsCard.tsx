import React from "react";
import clsx from "clsx";

interface StatsCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    subtext?: string;
    className?: string;
    accent?: boolean;
}

export default function StatsCard({ label, value, icon, subtext, className, accent = false }: StatsCardProps) {
    return (
        <div className={clsx(
            "glass rounded-2xl p-5 flex flex-col gap-3 transition-all duration-300 hover:border-red-500/30 group",
            className
        )}>
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted uppercase tracking-widest">{label}</span>
                <div className={clsx(
                    "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300",
                    accent
                        ? "red-gradient shadow-lg shadow-red-500/20"
                        : "bg-white/5 group-hover:bg-red-500/10"
                )}>
                    {icon}
                </div>
            </div>
            <div>
                <p className={clsx(
                    "text-2xl font-bold leading-none",
                    accent ? "text-primary" : "text-white"
                )}>{value}</p>
                {subtext && (
                    <p className="text-xs text-muted mt-1">{subtext}</p>
                )}
            </div>
        </div>
    );
}

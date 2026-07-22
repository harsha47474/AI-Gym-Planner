import React from "react";
import { Dumbbell, ChevronRight } from "lucide-react";
import type { DaySchedule } from "../../types";
import clsx from "clsx";

interface WorkoutCardProps {
    schedule: DaySchedule;
    onClick?: () => void;
    variant?: "default" | "today" | "upcoming";
    completionPercent?: number;
}

export default function WorkoutCard({ schedule, onClick, variant = "default", completionPercent }: WorkoutCardProps) {
    const totalSets = schedule.exercises.reduce((acc, ex) => acc + ex.sets, 0);
    const avgRpe = schedule.exercises.length > 0
        ? Math.round(schedule.exercises.reduce((acc, ex) => acc + ex.rpe, 0) / schedule.exercises.length * 10) / 10
        : 0;

    const isToday = variant === "today";
    const isUpcoming = variant === "upcoming";

    return (
        <div
            onClick={onClick}
            className={clsx(
                "glass rounded-2xl p-5 transition-all duration-300 group cursor-pointer",
                isToday && "border-red-500/30 shadow-lg shadow-red-500/10",
                !isToday && "hover:border-red-500/20",
                onClick && "cursor-pointer"
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={clsx(
                        "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm",
                        isToday ? "red-gradient shadow-red-500/20" : "bg-white/8"
                    )}>
                        <Dumbbell size={18} className="text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-white text-sm">{schedule.day}</h3>
                            {isToday && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                                    Today
                                </span>
                            )}
                            {isUpcoming && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-muted border border-white/10">
                                    Next
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-muted">{schedule.focus}</p>
                    </div>
                </div>
                <ChevronRight
                    size={18}
                    className={clsx(
                        "text-muted transition-all duration-300",
                        "group-hover:text-white group-hover:translate-x-0.5"
                    )}
                />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="rounded-xl bg-white/5 px-3 py-2 text-center">
                    <p className="text-lg font-bold text-white">{schedule.exercises.length}</p>
                    <p className="text-xs text-muted">Exercises</p>
                </div>
                <div className="rounded-xl bg-white/5 px-3 py-2 text-center">
                    <p className="text-lg font-bold text-white">{totalSets}</p>
                    <p className="text-xs text-muted">Total Sets</p>
                </div>
                <div className="rounded-xl bg-white/5 px-3 py-2 text-center">
                    <p className="text-lg font-bold text-white">{avgRpe}</p>
                    <p className="text-xs text-muted">Avg RPE</p>
                </div>
            </div>

            {/* Exercise preview */}
            <div className="flex flex-wrap gap-1.5">
                {schedule.exercises.slice(0, 3).map((ex) => (
                    <span key={ex.name} className="px-2 py-1 rounded-full text-xs bg-white/5 text-muted border border-white/8">
                        {ex.name.length > 18 ? ex.name.slice(0, 18) + "…" : ex.name}
                    </span>
                ))}
                {schedule.exercises.length > 3 && (
                    <span className="px-2 py-1 rounded-full text-xs bg-white/5 text-muted border border-white/8">
                        +{schedule.exercises.length - 3} more
                    </span>
                )}
            </div>

            {/* Progress bar if completion provided */}
            {completionPercent !== undefined && (
                <div className="mt-4">
                    <div className="flex justify-between text-xs text-muted mb-1.5">
                        <span>Progress</span>
                        <span>{Math.round(completionPercent)}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500"
                            style={{ width: `${completionPercent}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

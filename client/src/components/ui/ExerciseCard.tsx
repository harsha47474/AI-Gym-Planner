import React, { useState } from "react";
import { ChevronDown, ChevronUp, Clock, Repeat, Zap, StickyNote } from "lucide-react";
import type { Exercise } from "../../types";
import clsx from "clsx";

interface ExerciseCardProps {
    exercise: Exercise;
    index?: number;
    checked?: boolean;
    onCheck?: (name: string, checked: boolean) => void;
    showCheckbox?: boolean;
}

function RpeBar({ rpe }: { rpe: number }) {
    const color = rpe >= 8 ? "bg-red-500" : rpe >= 6 ? "bg-orange-500" : "bg-green-500";
    return (
        <div className="flex items-center gap-1.5">
            {Array.from({ length: 10 }).map((_, i) => (
                <div
                    key={i}
                    className={clsx(
                        "h-1.5 w-1.5 rounded-full transition-all",
                        i < rpe ? color : "bg-white/15"
                    )}
                />
            ))}
        </div>
    );
}

export default function ExerciseCard({ exercise, index, checked = false, onCheck, showCheckbox = false }: ExerciseCardProps) {
    const [expanded, setExpanded] = useState(false);

    const rpeColor =
        exercise.rpe >= 8
            ? "text-red-400 bg-red-500/10 border-red-500/20"
            : exercise.rpe >= 6
                ? "text-orange-400 bg-orange-500/10 border-orange-500/20"
                : "text-green-400 bg-green-500/10 border-green-500/20";

    return (
        <div className={clsx(
            "glass rounded-2xl overflow-hidden transition-all duration-300",
            checked && "opacity-60 border-white/5",
            !checked && "hover:border-red-500/20"
        )}>
            {/* Main row */}
            <div className="p-5">
                <div className="flex items-start gap-4">
                    {/* Checkbox or Number */}
                    {showCheckbox ? (
                        <button
                            onClick={() => onCheck?.(exercise.name, !checked)}
                            className={clsx(
                                "shrink-0 mt-0.5 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all",
                                checked
                                    ? "bg-red-500 border-red-500"
                                    : "border-white/20 hover:border-red-500/60"
                            )}
                        >
                            {checked && (
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </button>
                    ) : index !== undefined ? (
                        <div className="shrink-0 w-7 h-7 rounded-lg red-gradient flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-red-500/20">
                            {index + 1}
                        </div>
                    ) : null}

                    {/* Name + RPE */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-3">
                            <h3 className={clsx(
                                "font-semibold text-sm leading-tight",
                                checked ? "line-through text-muted" : "text-white"
                            )}>
                                {exercise.name}
                            </h3>
                            <span className={clsx(
                                "shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold border",
                                rpeColor
                            )}>
                                RPE {exercise.rpe}
                            </span>
                        </div>

                        {/* Stats grid */}
                        <div className="grid grid-cols-3 gap-3 mb-3">
                            <div className="flex items-center gap-1.5">
                                <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center">
                                    <Repeat size={11} className="text-muted" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted">Sets</p>
                                    <p className="text-sm font-bold text-white">{exercise.sets}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center">
                                    <Zap size={11} className="text-muted" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted">Reps</p>
                                    <p className="text-sm font-bold text-white">{exercise.reps}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center">
                                    <Clock size={11} className="text-muted" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted">Rest</p>
                                    <p className="text-sm font-bold text-white">{exercise.rest}</p>
                                </div>
                            </div>
                        </div>

                        {/* RPE bar */}
                        <RpeBar rpe={exercise.rpe} />
                    </div>
                </div>

                {/* Notes */}
                {exercise.notes && (
                    <div className="mt-3 ml-11 flex items-start gap-2 text-xs text-muted">
                        <StickyNote size={12} className="shrink-0 mt-0.5" />
                        <span>{exercise.notes}</span>
                    </div>
                )}
            </div>

            {/* Alternatives */}
            {exercise.alternatives && exercise.alternatives.length > 0 && (
                <div className="border-t border-white/5">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="w-full flex items-center justify-between px-5 py-3 text-xs text-muted hover:text-white hover:bg-white/5 transition-all"
                    >
                        <span className="font-medium">Alternatives ({exercise.alternatives.length})</span>
                        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    {expanded && (
                        <div className="px-5 pb-4 flex flex-wrap gap-2">
                            {exercise.alternatives.map((alt) => (
                                <span
                                    key={alt}
                                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white/80 hover:border-red-500/30 hover:text-white transition-all"
                                >
                                    {alt}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

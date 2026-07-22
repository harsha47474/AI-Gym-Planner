import React from "react";
import type { DaySchedule } from "../../types";
import clsx from "clsx";

interface WeeklyCalendarProps {
    workoutDays: string[]; // ["Monday", "Wednesday", "Friday"]
    selectedDay: string | null;
    onSelectDay: (day: string) => void;
    schedules: DaySchedule[];
}

const ALL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_ABBR: Record<string, string> = {
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
    Saturday: "Sat",
    Sunday: "Sun",
};

function getTodayName(): string {
    const day = new Date().getDay(); // 0=Sun, 1=Mon...
    const map = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return map[day];
}

export default function WeeklyCalendar({
    workoutDays,
    selectedDay,
    onSelectDay,
    schedules,
}: WeeklyCalendarProps) {
    const today = getTodayName();

    const getScheduleForDay = (day: string) =>
        schedules.find((s) => s.day.toLowerCase() === day.toLowerCase());

    return (
        <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">Weekly Schedule</h3>
                <span className="text-xs text-muted">{workoutDays.length} workout days</span>
            </div>

            {/* Day pills */}
            <div className="grid grid-cols-7 gap-1.5">
                {ALL_DAYS.map((day) => {
                    const isWorkoutDay = workoutDays.some(
                        (wd) => wd.toLowerCase() === day.toLowerCase()
                    );
                    const isSelected = selectedDay?.toLowerCase() === day.toLowerCase();
                    const isToday = today.toLowerCase() === day.toLowerCase();
                    const schedule = getScheduleForDay(day);

                    return (
                        <button
                            key={day}
                            onClick={() => isWorkoutDay ? onSelectDay(day) : undefined}
                            disabled={!isWorkoutDay}
                            className={clsx(
                                "flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl transition-all duration-200",
                                isSelected && isWorkoutDay && "red-gradient shadow-lg shadow-red-500/20 scale-105",
                                !isSelected && isWorkoutDay && "bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 cursor-pointer",
                                !isWorkoutDay && "bg-white/3 border border-white/5 opacity-40 cursor-default",
                                isToday && !isSelected && "ring-1 ring-red-500/40",
                            )}
                        >
                            <span className={clsx(
                                "text-xs font-semibold",
                                isSelected ? "text-white" : isWorkoutDay ? "text-red-400" : "text-muted"
                            )}>
                                {DAY_ABBR[day]}
                            </span>
                            {isWorkoutDay && (
                                <div className={clsx(
                                    "w-1.5 h-1.5 rounded-full",
                                    isSelected ? "bg-white" : "bg-red-400"
                                )} />
                            )}
                            {schedule && (
                                <span className={clsx(
                                    "text-[9px] text-center leading-tight hidden sm:block",
                                    isSelected ? "text-white/80" : "text-muted"
                                )}>
                                    {schedule.focus.split(" ")[0]}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/8">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm red-gradient" />
                    <span className="text-xs text-muted">Selected</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-red-500/20 border border-red-500/30" />
                    <span className="text-xs text-muted">Workout day</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-white/5 border border-white/10" />
                    <span className="text-xs text-muted">Rest day</span>
                </div>
            </div>
        </div>
    );
}

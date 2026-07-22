import React, { useState, useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import WeeklyCalendar from "../components/ui/WeeklyCalendar";
import ExerciseCard from "../components/ui/ExerciseCard";
import { Dumbbell, BarChart2, Zap, Play } from "lucide-react";
import { CardSkeleton } from "../components/ui/LoadingSkeleton";

export default function Schedule() {
    const { user, loading, plan } = useAuth();
    const navigate = useNavigate();
    const [selectedDay, setSelectedDay] = useState<string | null>(null);

    if (!user && !loading) return <Navigate to="/auth/sign-in" replace />;

    const workoutDays = plan?.weeklySchedule.map(s => s.day) ?? [];

    const selectedSchedule = useMemo(() =>
        selectedDay
            ? plan?.weeklySchedule.find(s => s.day.toLowerCase() === selectedDay.toLowerCase()) ?? null
            : null,
        [selectedDay, plan]
    );

    const totalSets = selectedSchedule?.exercises.reduce((acc, e) => acc + e.sets, 0) ?? 0;
    const avgRpe = selectedSchedule && selectedSchedule.exercises.length > 0
        ? (selectedSchedule.exercises.reduce((acc, e) => acc + e.rpe, 0) / selectedSchedule.exercises.length).toFixed(1)
        : null;
    const estimatedTime = selectedSchedule
        ? selectedSchedule.exercises.reduce((acc, e) => {
            const restMins = parseFloat(e.rest.replace(/[^0-9.]/g, "")) || 1.5;
            return acc + (e.sets * 2.5) + (restMins * (e.sets - 1));
        }, 0)
        : 0;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Weekly Schedule</h1>
                <p className="text-muted mt-1 text-sm">
                    {plan
                        ? `${workoutDays.length} training days · ${plan.overview.frequency}`
                        : "No plan available"}
                </p>
            </div>

            {/* Calendar */}
            {loading ? (
                <CardSkeleton lines={2} />
            ) : plan ? (
                <WeeklyCalendar
                    workoutDays={workoutDays}
                    selectedDay={selectedDay}
                    onSelectDay={(day) => setSelectedDay(prev => prev?.toLowerCase() === day.toLowerCase() ? null : day)}
                    schedules={plan.weeklySchedule}
                />
            ) : (
                <div className="glass rounded-2xl p-8 text-center">
                    <Dumbbell size={32} className="text-muted mx-auto mb-3" />
                    <p className="text-white font-semibold">No Schedule Available</p>
                    <p className="text-muted text-sm mt-1">Generate an AI plan to see your weekly schedule.</p>
                </div>
            )}

            {/* Selected day exercises */}
            {selectedSchedule && (
                <section>
                    {/* Day header */}
                    <div className="glass rounded-2xl p-5 mb-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h2 className="text-xl font-bold text-white">{selectedSchedule.day}</h2>
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold red-gradient text-white">
                                        {selectedSchedule.focus}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted">
                                    <span className="flex items-center gap-1.5">
                                        <Dumbbell size={13} /> {selectedSchedule.exercises.length} exercises
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <BarChart2 size={13} /> {totalSets} total sets
                                    </span>
                                    {avgRpe && (
                                        <span className="flex items-center gap-1.5">
                                            <Zap size={13} /> RPE {avgRpe}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => navigate(`/workout/${selectedSchedule.day.toLowerCase()}`)}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl red-gradient text-white text-sm font-semibold shadow-lg shadow-red-500/20 hover:opacity-90 transition-all"
                            >
                                <Play size={14} /> Start
                            </button>
                        </div>
                    </div>

                    {/* Exercise list */}
                    <div className="space-y-3">
                        {selectedSchedule.exercises.map((exercise, index) => (
                            <ExerciseCard key={exercise.name} exercise={exercise} index={index} />
                        ))}
                    </div>

                    {/* Workout summary */}
                    <div className="glass rounded-2xl p-5 mt-6">
                        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Workout Summary</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-red-400">{selectedSchedule.exercises.length}</p>
                                <p className="text-xs text-muted mt-0.5">Exercises</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-red-400">{totalSets}</p>
                                <p className="text-xs text-muted mt-0.5">Total Sets</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-red-400">~{Math.round(estimatedTime)}m</p>
                                <p className="text-xs text-muted mt-0.5">Est. Duration</p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* No selection prompt */}
            {!selectedSchedule && plan && (
                <div className="glass rounded-2xl p-8 text-center border border-dashed border-white/10">
                    <p className="text-muted text-sm">Select a workout day above to view exercises</p>
                </div>
            )}
        </div>
    );
}

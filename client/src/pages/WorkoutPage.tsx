import React, { useState, useMemo, useEffect } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ExerciseCard from "../components/ui/ExerciseCard";
import ProgressBar from "../components/ui/ProgressBar";
import RestTimer from "../components/ui/RestTimer";
import { ArrowLeft, Timer, CheckCircle2, Trophy, Dumbbell, Clock } from "lucide-react";
import clsx from "clsx";

function saveWorkoutToHistory(day: string, focus: string, completedCount: number, total: number, durationMs: number) {
    try {
        const session = {
            id: Date.now().toString(),
            day,
            focus,
            completedExercises: completedCount,
            totalExercises: total,
            completedAt: new Date().toISOString(),
            durationMinutes: Math.round(durationMs / 60000),
        };

        const existing = JSON.parse(localStorage.getItem("workoutHistory") || "[]");
        existing.unshift(session);
        localStorage.setItem("workoutHistory", JSON.stringify(existing.slice(0, 50)));

        // Update weekly workouts for streak
        const weekly = JSON.parse(localStorage.getItem("weeklyWorkouts") || "[]");
        weekly.push(new Date().toISOString());
        localStorage.setItem("weeklyWorkouts", JSON.stringify(weekly.slice(-30)));

        // Update streak
        const streakData = JSON.parse(localStorage.getItem("workoutStreak") || '{"count":0,"lastDate":""}');
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const lastDate = streakData.lastDate ? new Date(streakData.lastDate).toDateString() : "";
        const todayStr = new Date().toDateString();

        if (lastDate === todayStr) {
            // already counted today
        } else if (lastDate === yesterday.toDateString()) {
            streakData.count += 1;
        } else {
            streakData.count = 1;
        }
        streakData.lastDate = new Date().toISOString();
        localStorage.setItem("workoutStreak", JSON.stringify(streakData));
    } catch { /* ignore */ }
}

export default function WorkoutPage() {
    const { day } = useParams<{ day: string }>();
    const { user, loading, plan } = useAuth();
    const navigate = useNavigate();
    const [checked, setChecked] = useState<Set<string>>(new Set());
    const [timerOpen, setTimerOpen] = useState(false);
    const [timerSeconds, setTimerSeconds] = useState(120);
    const [finished, setFinished] = useState(false);
    const [startTime] = useState(Date.now());

    if (!user && !loading) return <Navigate to="/auth/sign-in" replace />;

    const schedule = useMemo(() => {
        if (!plan || !day) return null;
        return plan.weeklySchedule.find(s => s.day.toLowerCase() === day.toLowerCase()) ?? null;
    }, [plan, day]);

    const progress = schedule
        ? (checked.size / schedule.exercises.length) * 100
        : 0;

    const handleCheck = (name: string, isChecked: boolean) => {
        setChecked(prev => {
            const next = new Set(prev);
            if (isChecked) {
                next.add(name);
                // Auto-open rest timer on check
                const exercise = schedule?.exercises.find(e => e.name === name);
                if (exercise) {
                    const restStr = exercise.rest;
                    const match = restStr.match(/(\d+(?:\.\d+)?)/);
                    if (match) {
                        const mins = parseFloat(match[1]);
                        setTimerSeconds(Math.round(mins * 60));
                        setTimerOpen(true);
                    }
                }
            } else {
                next.delete(name);
            }
            return next;
        });
    };

    const handleFinish = () => {
        if (!schedule) return;
        saveWorkoutToHistory(
            schedule.day,
            schedule.focus,
            checked.size,
            schedule.exercises.length,
            Date.now() - startTime,
        );
        setFinished(true);
    };

    if (finished) {
        const duration = Math.round((Date.now() - startTime) / 60000);
        return (
            <div className="max-w-lg mx-auto px-4 py-16 text-center">
                <div className="glass rounded-3xl p-10">
                    <div className="w-20 h-20 rounded-2xl red-gradient flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-500/20">
                        <Trophy size={36} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Workout Complete!</h1>
                    <p className="text-muted text-sm mb-8">{schedule?.day} · {schedule?.focus}</p>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="glass rounded-xl p-3 text-center">
                            <p className="text-xl font-bold text-red-400">{checked.size}</p>
                            <p className="text-xs text-muted">Done</p>
                        </div>
                        <div className="glass rounded-xl p-3 text-center">
                            <p className="text-xl font-bold text-red-400">{schedule?.exercises.length}</p>
                            <p className="text-xs text-muted">Total</p>
                        </div>
                        <div className="glass rounded-xl p-3 text-center">
                            <p className="text-xl font-bold text-red-400">{duration}m</p>
                            <p className="text-xs text-muted">Duration</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate("/")}
                            className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-all"
                        >
                            Home
                        </button>
                        <button
                            onClick={() => navigate("/progress")}
                            className="flex-1 py-3 rounded-xl red-gradient text-white text-sm font-semibold shadow-lg shadow-red-500/20 hover:opacity-90 transition-all"
                        >
                            View Progress
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="glass rounded-2xl p-5 animate-pulse space-y-3">
                        <div className="h-4 bg-white/5 rounded-lg w-40" />
                        <div className="h-3 bg-white/5 rounded-lg w-full" />
                    </div>
                ))}
            </div>
        );
    }

    if (!schedule) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <div className="glass rounded-2xl p-10">
                    <Dumbbell size={32} className="text-muted mx-auto mb-3" />
                    <p className="text-white font-semibold">No workout for "{day}"</p>
                    <p className="text-muted text-sm mt-1">This may be a rest day or an invalid route.</p>
                    <button
                        onClick={() => navigate("/schedule")}
                        className="mt-4 px-5 py-2.5 rounded-xl red-gradient text-white text-sm font-semibold"
                    >
                        View Schedule
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="w-9 h-9 rounded-xl glass flex items-center justify-center text-muted hover:text-white transition-all"
                >
                    <ArrowLeft size={16} />
                </button>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold text-white">{schedule.day}</h1>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold red-gradient text-white">
                            {schedule.focus}
                        </span>
                    </div>
                    <p className="text-xs text-muted mt-0.5">{schedule.exercises.length} exercises</p>
                </div>
                <button
                    onClick={() => setTimerOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass text-muted hover:text-white hover:border-red-500/30 transition-all text-xs font-medium"
                >
                    <Timer size={14} /> Timer
                </button>
            </div>

            {/* Progress bar */}
            <div className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-red-400" />
                        <span className="text-sm font-medium text-white">
                            {checked.size} / {schedule.exercises.length} completed
                        </span>
                    </div>
                    <span className="text-sm font-bold text-red-400">{Math.round(progress)}%</span>
                </div>
                <ProgressBar progress={progress} size="lg" />

                {/* Time tracker */}
                <div className="flex items-center gap-1.5 mt-3 text-xs text-muted">
                    <Clock size={12} />
                    <span>Started {new Date(startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
            </div>

            {/* Exercise list */}
            <div className="space-y-3">
                {schedule.exercises.map((exercise, index) => (
                    <ExerciseCard
                        key={exercise.name}
                        exercise={exercise}
                        index={index}
                        checked={checked.has(exercise.name)}
                        onCheck={handleCheck}
                        showCheckbox
                    />
                ))}
            </div>

            {/* Finish button */}
            <div className="sticky bottom-6 pt-2">
                <button
                    onClick={handleFinish}
                    disabled={checked.size === 0}
                    className={clsx(
                        "w-full py-4 rounded-2xl text-sm font-bold transition-all duration-300 shadow-xl",
                        checked.size > 0
                            ? "red-gradient text-white shadow-red-500/30 hover:opacity-90"
                            : "bg-white/5 border border-white/10 text-muted cursor-not-allowed"
                    )}
                >
                    {checked.size === schedule.exercises.length
                        ? "🏆 Finish Workout"
                        : checked.size > 0
                            ? `Finish Workout (${checked.size}/${schedule.exercises.length} done)`
                            : "Check off exercises to finish"}
                </button>
            </div>

            {/* Rest Timer Modal */}
            <RestTimer
                isOpen={timerOpen}
                onClose={() => setTimerOpen(false)}
                defaultSeconds={timerSeconds}
            />
        </div>
    );
}

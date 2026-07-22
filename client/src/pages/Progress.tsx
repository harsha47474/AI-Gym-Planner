import React, { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Flame, TrendingUp, Calendar, Dumbbell, Clock, CheckCircle2, BarChart2 } from "lucide-react";
import ProgressBar from "../components/ui/ProgressBar";
import StatsCard from "../components/ui/StatsCard";

interface Session {
    id: string;
    day: string;
    focus: string;
    completedExercises: number;
    totalExercises: number;
    completedAt: string;
    durationMinutes: number;
}

function getStreak(): { count: number; lastDate: string } {
    try {
        return JSON.parse(localStorage.getItem("workoutStreak") || '{"count":0,"lastDate":""}');
    } catch {
        return { count: 0, lastDate: "" };
    }
}

function getHistory(): Session[] {
    try {
        return JSON.parse(localStorage.getItem("workoutHistory") || "[]");
    } catch {
        return [];
    }
}

function getWeekDays(): string[] {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(d.toDateString());
    }
    return days;
}

export default function Progress() {
    const { user, loading, plan } = useAuth();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [streak, setStreak] = useState({ count: 0, lastDate: "" });

    useEffect(() => {
        setSessions(getHistory());
        setStreak(getStreak());
    }, []);

    if (!user && !loading) return <Navigate to="/auth/sign-in" replace />;

    const weekDays = getWeekDays();
    const workoutsThisWeek = sessions.filter(s => {
        const sessionDate = new Date(s.completedAt).toDateString();
        return weekDays.includes(sessionDate);
    });

    const weeklyTarget = plan?.weeklySchedule.length ?? 3;
    const weeklyCompletion = Math.min(100, (workoutsThisWeek.length / weeklyTarget) * 100);

    const totalWorkouts = sessions.length;
    const totalMinutes = sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
    const avgCompletion = sessions.length > 0
        ? Math.round(sessions.reduce((acc, s) => acc + (s.completedExercises / s.totalExercises) * 100, 0) / sessions.length)
        : 0;

    const formatDate = (iso: string) => {
        try {
            return new Date(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
        } catch {
            return iso;
        }
    };

    const formatTime = (iso: string) => {
        try {
            return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        } catch { return ""; }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Progress</h1>
                <p className="text-muted mt-1 text-sm">Track your consistency and achievements</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatsCard
                    label="Current Streak"
                    value={streak.count}
                    subtext="days in a row"
                    icon={<Flame size={15} className="text-white" />}
                    accent
                />
                <StatsCard
                    label="Total Workouts"
                    value={totalWorkouts || "0"}
                    subtext="all time"
                    icon={<Dumbbell size={15} className="text-muted" />}
                />
                <StatsCard
                    label="Total Minutes"
                    value={totalMinutes ? `${totalMinutes}m` : "0m"}
                    subtext="time trained"
                    icon={<Clock size={15} className="text-muted" />}
                />
                <StatsCard
                    label="Avg Completion"
                    value={`${avgCompletion}%`}
                    subtext="exercises done"
                    icon={<CheckCircle2 size={15} className="text-muted" />}
                />
            </div>

            {/* Weekly Consistency */}
            <section>
                <h2 className="text-lg font-bold text-white mb-4">This Week</h2>
                <div className="glass rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <TrendingUp size={16} className="text-red-400" />
                            <span className="text-sm font-medium text-white">Weekly Consistency</span>
                        </div>
                        <span className="text-sm font-bold text-red-400">
                            {workoutsThisWeek.length} / {weeklyTarget} workouts
                        </span>
                    </div>
                    <ProgressBar progress={weeklyCompletion} size="lg" showPercent />

                    {/* 7-day heatmap */}
                    <div className="pt-2">
                        <p className="text-xs text-muted mb-2 uppercase tracking-wider">Last 7 Days</p>
                        <div className="flex gap-2">
                            {weekDays.map((dateStr) => {
                                const hasWorkout = sessions.some(
                                    s => new Date(s.completedAt).toDateString() === dateStr
                                );
                                const isToday = dateStr === new Date().toDateString();
                                const shortDay = new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" });
                                return (
                                    <div key={dateStr} className="flex-1 flex flex-col items-center gap-1.5">
                                        <div className={`w-full aspect-square rounded-lg transition-all ${hasWorkout
                                            ? "red-gradient shadow-md shadow-red-500/20"
                                            : isToday
                                                ? "bg-white/10 border border-white/20"
                                                : "bg-white/5"
                                            }`} />
                                        <span className={`text-xs ${isToday ? "text-white font-semibold" : "text-muted"}`}>
                                            {shortDay}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Analytics placeholder */}
            <section>
                <h2 className="text-lg font-bold text-white mb-4">Analytics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="glass rounded-2xl p-6 text-center">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                            <BarChart2 size={22} className="text-muted" />
                        </div>
                        <p className="text-white font-semibold text-sm">Volume Tracker</p>
                        <p className="text-muted text-xs mt-1">Coming soon — track your weekly volume over time</p>
                    </div>
                    <div className="glass rounded-2xl p-6 text-center">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                            <TrendingUp size={22} className="text-muted" />
                        </div>
                        <p className="text-white font-semibold text-sm">Strength Progression</p>
                        <p className="text-muted text-xs mt-1">Coming soon — log weights and track progression</p>
                    </div>
                </div>
            </section>

            {/* Workout History */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white">History</h2>
                    {sessions.length > 0 && (
                        <span className="text-xs text-muted">{sessions.length} sessions</span>
                    )}
                </div>

                {sessions.length === 0 ? (
                    <div className="glass rounded-2xl p-10 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                            <Dumbbell size={24} className="text-muted" />
                        </div>
                        <p className="text-white font-semibold mb-1">No workouts yet</p>
                        <p className="text-muted text-sm mb-4">Complete your first workout to start tracking progress.</p>
                        <Link
                            to="/schedule"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl red-gradient text-white text-sm font-semibold shadow-lg shadow-red-500/20"
                        >
                            <Calendar size={15} /> View Schedule
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {sessions.map((session) => {
                            const completion = Math.round((session.completedExercises / session.totalExercises) * 100);
                            return (
                                <div key={session.id} className="glass rounded-2xl p-5 hover:border-red-500/20 transition-all">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <h3 className="font-semibold text-white text-sm">{session.day}</h3>
                                                <span className="px-2 py-0.5 rounded-full text-xs font-medium red-gradient text-white">
                                                    {session.focus}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted">
                                                {formatDate(session.completedAt)} at {formatTime(session.completedAt)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-red-400">{completion}%</p>
                                            <p className="text-xs text-muted">{session.durationMinutes}m</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-muted mb-2">
                                        <span>{session.completedExercises} / {session.totalExercises} exercises</span>
                                    </div>
                                    <ProgressBar progress={completion} size="sm" color={completion === 100 ? "green" : "red"} />
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}

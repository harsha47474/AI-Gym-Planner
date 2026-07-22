import React, { useMemo } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Dumbbell, Calendar, BarChart2, User, Flame, ChevronRight, Zap, TrendingUp, Clock } from "lucide-react";
import WorkoutCard from "../components/ui/WorkoutCard";
import StatsCard from "../components/ui/StatsCard";
import { CardSkeleton, StatSkeleton } from "../components/ui/LoadingSkeleton";

function getTodayName(): string {
    const day = new Date().getDay();
    const map = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return map[day];
}

function getStreakCount(): number {
    try {
        const raw = localStorage.getItem("workoutStreak");
        if (!raw) return 0;
        const data = JSON.parse(raw);
        return typeof data.count === "number" ? data.count : 0;
    } catch {
        return 0;
    }
}

function getWeeklyProgress(workoutDays: string[]): number {
    try {
        const raw = localStorage.getItem("weeklyWorkouts");
        if (!raw) return 0;
        const data = JSON.parse(raw) as string[];
        const thisWeek = data.filter((d: string) => {
            const diff = (Date.now() - new Date(d).getTime()) / (1000 * 60 * 60 * 24);
            return diff < 7;
        });
        return Math.min(100, (thisWeek.length / workoutDays.length) * 100);
    } catch {
        return 0;
    }
}

export default function Home() {
    const { user, loading, plan } = useAuth();
    const navigate = useNavigate();

    const onboardingCompleted =
        typeof window !== "undefined" &&
        window.localStorage.getItem("onboardingCompleted") === "true";

    if (!user && !loading) {
        return <Navigate to="/auth/sign-in" replace />;
    }

    if (user && !onboardingCompleted && !loading) {
        return <Navigate to="/onboarding" replace />;
    }

    const today = getTodayName();
    const streak = getStreakCount();

    const todaySchedule = useMemo(() =>
        plan?.weeklySchedule.find(s => s.day.toLowerCase() === today.toLowerCase()),
        [plan, today]
    );

    const nextSchedule = useMemo(() => {
        if (!plan?.weeklySchedule) return null;
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const todayIdx = days.findIndex(d => d.toLowerCase() === today.toLowerCase());
        for (let i = 1; i <= 7; i++) {
            const nextDay = days[(todayIdx + i) % 7];
            const found = plan.weeklySchedule.find(s => s.day.toLowerCase() === nextDay.toLowerCase());
            if (found) return found;
        }
        return null;
    }, [plan, today]);

    const weeklyProgress = plan ? getWeeklyProgress(plan.weeklySchedule.map(s => s.day)) : 0;

    const totalExercises = plan?.weeklySchedule.reduce((acc, day) => acc + day.exercises.length, 0) ?? 0;
    const totalSets = plan?.weeklySchedule.reduce((acc, day) =>
        acc + day.exercises.reduce((a, e) => a + e.sets, 0), 0) ?? 0;

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)}
                </div>
                <CardSkeleton lines={4} />
                <CardSkeleton lines={3} />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

            {/* Welcome */}
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-muted font-medium">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
                    <h1 className="text-3xl font-bold text-white mt-1">
                        Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}! 👋
                    </h1>
                    <p className="text-muted mt-1 text-sm">
                        {todaySchedule
                            ? `You have a ${todaySchedule.focus} session today`
                            : "Rest day — recover and recharge"}
                    </p>
                </div>
                {streak > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20">
                        <Flame size={18} className="text-red-400" />
                        <div className="text-right">
                            <p className="text-lg font-bold text-red-400">{streak}</p>
                            <p className="text-xs text-muted">streak</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatsCard
                    label="Workout Days"
                    value={plan?.weeklySchedule.length ?? "—"}
                    subtext="per week"
                    icon={<Calendar size={15} className="text-white" />}
                    accent
                />
                <StatsCard
                    label="Exercises"
                    value={totalExercises || "—"}
                    subtext="total in plan"
                    icon={<Dumbbell size={15} className="text-muted" />}
                />
                <StatsCard
                    label="Weekly Sets"
                    value={totalSets || "—"}
                    subtext="across all days"
                    icon={<Zap size={15} className="text-muted" />}
                />
                <StatsCard
                    label="Streak"
                    value={streak || "0"}
                    subtext="days in a row"
                    icon={<Flame size={15} className="text-muted" />}
                />
            </div>

            {/* Today's workout */}
            <section>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold text-white">Today's Workout</h2>
                    {todaySchedule && (
                        <Link
                            to={`/workout/${today.toLowerCase()}`}
                            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                        >
                            Start <ChevronRight size={13} />
                        </Link>
                    )}
                </div>
                {todaySchedule ? (
                    <WorkoutCard
                        schedule={todaySchedule}
                        variant="today"
                        onClick={() => navigate(`/workout/${today.toLowerCase()}`)}
                    />
                ) : (
                    <div className="glass rounded-2xl p-8 text-center">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                            <Clock size={22} className="text-muted" />
                        </div>
                        <p className="text-white font-semibold">Rest Day</p>
                        <p className="text-muted text-sm mt-1">No workout scheduled for today. Enjoy your recovery!</p>
                    </div>
                )}
            </section>

            {/* Next workout */}
            {nextSchedule && (
                <section>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-bold text-white">Next Workout</h2>
                        <Link
                            to="/schedule"
                            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                        >
                            Full schedule <ChevronRight size={13} />
                        </Link>
                    </div>
                    <WorkoutCard
                        schedule={nextSchedule}
                        variant="upcoming"
                        onClick={() => navigate(`/workout/${nextSchedule.day.toLowerCase()}`)}
                    />
                </section>
            )}

            {/* Weekly progress */}
            <section>
                <h2 className="text-lg font-bold text-white mb-3">Weekly Progress</h2>
                <div className="glass rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <TrendingUp size={16} className="text-red-400" />
                            <span className="text-sm font-medium text-white">This Week</span>
                        </div>
                        <span className="text-sm font-bold text-red-400">{Math.round(weeklyProgress)}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-700 rounded-full"
                            style={{ width: `${weeklyProgress}%` }}
                        />
                    </div>
                    <p className="text-xs text-muted mt-2">
                        {weeklyProgress === 0
                            ? "Start your first workout this week!"
                            : weeklyProgress === 100
                                ? "Amazing! You've completed all workouts this week 🎉"
                                : "Keep going! You're making great progress."}
                    </p>
                </div>
            </section>

            {/* Quick actions */}
            <section>
                <h2 className="text-lg font-bold text-white mb-3">Quick Actions</h2>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        {
                            label: "Start Workout",
                            icon: <Dumbbell size={20} className="text-white" />,
                            to: todaySchedule ? `/workout/${today.toLowerCase()}` : "/schedule",
                            accent: true,
                        },
                        {
                            label: "Schedule",
                            icon: <Calendar size={20} className="text-red-400" />,
                            to: "/schedule",
                            accent: false,
                        },
                        {
                            label: "Profile",
                            icon: <User size={20} className="text-red-400" />,
                            to: "/profile",
                            accent: false,
                        },
                    ].map((action) => (
                        <Link
                            key={action.label}
                            to={action.to}
                            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300 hover:scale-105 ${action.accent
                                ? "red-gradient border-red-500/30 shadow-lg shadow-red-500/20"
                                : "glass border-white/10 hover:border-red-500/20"
                                }`}
                        >
                            {action.icon}
                            <span className={`text-xs font-semibold ${action.accent ? "text-white" : "text-muted"}`}>
                                {action.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* No plan state */}
            {!plan && !loading && (
                <div className="glass rounded-2xl p-8 text-center border border-red-500/20">
                    <div className="w-14 h-14 rounded-2xl red-gradient flex items-center justify-center mx-auto mb-4">
                        <Dumbbell size={26} className="text-white" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">No Plan Yet</h3>
                    <p className="text-muted text-sm mb-4">Complete onboarding to generate your AI training plan.</p>
                    <Link
                        to="/onboarding"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl red-gradient text-white text-sm font-semibold shadow-lg shadow-red-500/20 hover:opacity-90 transition-opacity"
                    >
                        <BarChart2 size={15} /> Get Started
                    </Link>
                </div>
            )}
        </div>
    );
}
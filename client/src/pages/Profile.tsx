import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Dumbbell, RefreshCw, Calendar, BarChart2, Zap, TrendingUp, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import PlanOverviewCard from "../components/ui/PlanOverviewCard";
import StatsCard from "../components/ui/StatsCard";
import ConfirmationModal from "../components/ui/ConfirmationModal";
import { CardSkeleton, StatSkeleton } from "../components/ui/LoadingSkeleton";

type RegenStatus = "idle" | "loading" | "success" | "error";

export default function Profile() {
    const { user, loading, plan, generatePlan, refreshData } = useAuth();
    const [modalOpen, setModalOpen] = useState(false);
    const [regenStatus, setRegenStatus] = useState<RegenStatus>("idle");
    const [regenError, setRegenError] = useState("");

    const onboardingCompleted =
        typeof window !== "undefined" &&
        window.localStorage.getItem("onboardingCompleted") === "true";

    if (!user && !loading) {
        return <Navigate to="/auth/sign-in" replace />;
    }

    if (!onboardingCompleted && !loading) {
        return <Navigate to="/onboarding" replace />;
    }

    const handleRegenerate = async () => {
        setModalOpen(false);
        setRegenStatus("loading");
        setRegenError("");
        try {
            await generatePlan();
            await refreshData();
            setRegenStatus("success");
            setTimeout(() => setRegenStatus("idle"), 3000);
        } catch (err) {
            setRegenError(err instanceof Error ? err.message : "Failed to regenerate plan");
            setRegenStatus("error");
            setTimeout(() => setRegenStatus("idle"), 4000);
        }
    };

    // Compute stats
    const workoutDays = plan?.weeklySchedule.length ?? 0;
    const totalExercises = plan?.weeklySchedule.reduce((acc, day) => acc + day.exercises.length, 0) ?? 0;
    const allRpes = plan?.weeklySchedule.flatMap(day => day.exercises.map(e => e.rpe)) ?? [];
    const avgRpe = allRpes.length > 0
        ? (allRpes.reduce((a, b) => a + b, 0) / allRpes.length).toFixed(1)
        : "—";
    const weeklySets = plan?.weeklySchedule.reduce((acc, day) =>
        acc + day.exercises.reduce((a, e) => a + e.sets, 0), 0) ?? 0;

    const initials = user?.name
        ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
        : "?";

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

            {/* Status banner */}
            {regenStatus === "success" && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium animate-[fadeInScale_0.3s_ease-out]">
                    <CheckCircle2 size={18} />
                    Plan regenerated successfully!
                </div>
            )}
            {regenStatus === "error" && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                    <XCircle size={18} />
                    {regenError || "Failed to regenerate plan. Please try again."}
                </div>
            )}

            {/* Profile Header */}
            <div className="glass rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-2xl red-gradient flex items-center justify-center shadow-xl shadow-red-500/20 shrink-0">
                        <span className="text-2xl font-bold text-white">{initials}</span>
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl font-bold text-white truncate">{user?.name ?? "Athlete"}</h1>
                        <p className="text-muted text-sm mt-0.5">{user?.email ?? ""}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/15 text-red-400 border border-red-500/20">
                                {plan?.overview.split ? plan.overview.split.replace(/_/g, " / ") : "No Plan"}
                            </span>
                            {plan && (
                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/8 text-muted border border-white/10">
                                    v{plan.version}
                                </span>
                            )}
                        </div>
                    </div>
                    {/* Regenerate button */}
                    <button
                        onClick={() => setModalOpen(true)}
                        disabled={regenStatus === "loading"}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl red-gradient text-white text-sm font-semibold shadow-lg shadow-red-500/20 hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                    >
                        {regenStatus === "loading" ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <RefreshCw size={16} />
                        )}
                        {regenStatus === "loading" ? "Generating..." : "Regenerate Plan"}
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <section>
                <h2 className="text-lg font-bold text-white mb-4">Plan Stats</h2>
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <StatsCard
                            label="Workout Days"
                            value={workoutDays || "—"}
                            subtext="per week"
                            icon={<Calendar size={15} className="text-white" />}
                            accent
                        />
                        <StatsCard
                            label="Exercises"
                            value={totalExercises || "—"}
                            subtext="in plan"
                            icon={<Dumbbell size={15} className="text-muted" />}
                        />
                        <StatsCard
                            label="Avg RPE"
                            value={avgRpe}
                            subtext="effort level"
                            icon={<Zap size={15} className="text-muted" />}
                        />
                        <StatsCard
                            label="Weekly Sets"
                            value={weeklySets || "—"}
                            subtext="total volume"
                            icon={<BarChart2 size={15} className="text-muted" />}
                        />
                    </div>
                )}
            </section>

            {/* Plan Overview */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white">AI Plan Overview</h2>
                    {plan && (
                        <span className="flex items-center gap-1.5 text-xs text-muted">
                            <TrendingUp size={13} className="text-red-400" />
                            Active Plan
                        </span>
                    )}
                </div>
                {loading ? (
                    <CardSkeleton lines={6} />
                ) : plan ? (
                    <PlanOverviewCard plan={plan} />
                ) : (
                    <div className="glass rounded-2xl p-10 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                            <Dumbbell size={24} className="text-muted" />
                        </div>
                        <p className="text-white font-semibold mb-1">No plan generated yet</p>
                        <p className="text-muted text-sm">Complete onboarding or regenerate your plan.</p>
                    </div>
                )}
            </section>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleRegenerate}
                title="Regenerate AI Plan?"
                description="This will create a new training plan based on your profile. Your current plan will be archived and you can view past plans on the Plans page."
                confirmLabel="Regenerate"
                cancelLabel="Keep Current"
                variant="warning"
                loading={regenStatus === "loading"}
            />

            <style>{`
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.97); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
}
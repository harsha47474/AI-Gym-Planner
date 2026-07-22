import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import type { PlanListItem } from "../types";
import { Dumbbell, Trash2, Eye, RotateCcw, Calendar, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import ConfirmationModal from "../components/ui/ConfirmationModal";
import ExerciseCard from "../components/ui/ExerciseCard";
import { CardSkeleton } from "../components/ui/LoadingSkeleton";

export default function Plans() {
    const { user, loading, plan, refreshData } = useAuth();
    const [plans, setPlans] = useState<PlanListItem[]>([]);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [restoreTarget, setRestoreTarget] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    if (!user && !loading) return <Navigate to="/auth/sign-in" replace />;

    useEffect(() => {
        if (!user?.id) return;
        setFetchLoading(true);
        api.getAllPlans(user.id).then(data => {
            setPlans(Array.isArray(data) ? data : []);
        }).finally(() => setFetchLoading(false));
    }, [user?.id]);

    // If backend doesn't have /all, show current plan only
    const displayPlans: PlanListItem[] = plans.length > 0 ? plans : plan ? [{
        id: plan.id,
        userId: plan.userId,
        planJson: {
            overview: plan.overview,
            weeklySchedule: plan.weeklySchedule,
            progression: plan.progression,
        },
        planText: "",
        version: plan.version,
        createdAt: plan.createdAt,
    }] : [];

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setActionLoading(true);
        await api.deletePlan(deleteTarget);
        setPlans(prev => prev.filter(p => p.id !== deleteTarget));
        setDeleteTarget(null);
        setActionLoading(false);
    };

    const handleRestore = async () => {
        if (!restoreTarget || !user?.id) return;
        setActionLoading(true);
        await api.restorePlan(restoreTarget, user.id);
        await refreshData();
        setRestoreTarget(null);
        setActionLoading(false);
    };

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString("en-US", {
                year: "numeric", month: "short", day: "numeric",
            });
        } catch { return dateStr; }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Training Plans</h1>
                <p className="text-muted mt-1 text-sm">View and manage your AI-generated training plans</p>
            </div>

            {/* Plans list */}
            {loading || fetchLoading ? (
                <div className="space-y-4">
                    {Array.from({ length: 2 }).map((_, i) => <CardSkeleton key={i} lines={4} />)}
                </div>
            ) : displayPlans.length === 0 ? (
                <div className="glass rounded-2xl p-10 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                        <Dumbbell size={24} className="text-muted" />
                    </div>
                    <p className="text-white font-semibold mb-1">No plans yet</p>
                    <p className="text-muted text-sm">Generate your first AI plan from the Profile page.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {displayPlans.map((p) => {
                        const isCurrent = p.id === plan?.id;
                        const isExpanded = expandedPlanId === p.id;
                        const totalExercises = p.planJson.weeklySchedule?.reduce(
                            (acc: number, day: any) => acc + (day.exercises?.length ?? 0), 0
                        ) ?? 0;

                        return (
                            <div key={p.id} className={`glass rounded-2xl overflow-hidden transition-all duration-300 ${isCurrent ? "border-red-500/30" : "hover:border-white/10"}`}>
                                {/* Plan header */}
                                <div className="p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-start gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isCurrent ? "red-gradient shadow-md shadow-red-500/20" : "bg-white/8"}`}>
                                                <Dumbbell size={18} className="text-white" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="font-bold text-white">Version {p.version}</h3>
                                                    {isCurrent && (
                                                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/20">
                                                            Active
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted mt-0.5">
                                                    {formatDate(p.createdAt)} · {p.planJson.overview?.split?.replace(/_/g, " / ") ?? "—"} · {p.planJson.weeklySchedule?.length ?? 0} days/week · {totalExercises} exercises
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 shrink-0">
                                            {!isCurrent && (
                                                <button
                                                    onClick={() => setRestoreTarget(p.id)}
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-green-400 hover:bg-green-500/10 transition-all"
                                                    title="Restore plan"
                                                >
                                                    <RotateCcw size={15} />
                                                </button>
                                            )}
                                            {!isCurrent && (
                                                <button
                                                    onClick={() => setDeleteTarget(p.id)}
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
                                                    title="Delete plan"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setExpandedPlanId(isExpanded ? null : p.id)}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-white hover:bg-white/10 transition-all"
                                                title="View plan"
                                            >
                                                {isExpanded ? <ChevronUp size={15} /> : <Eye size={15} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Goal & progression */}
                                    {p.planJson.overview?.goal && (
                                        <p className="mt-3 ml-13 text-sm text-muted leading-relaxed line-clamp-2">
                                            🎯 {p.planJson.overview.goal}
                                        </p>
                                    )}
                                </div>

                                {/* Expanded view */}
                                {isExpanded && (
                                    <div className="border-t border-white/8 p-5 space-y-6">
                                        {p.planJson.weeklySchedule?.map((day: any) => (
                                            <div key={day.day}>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Calendar size={14} className="text-red-400" />
                                                    <h4 className="font-semibold text-white text-sm">{day.day}</h4>
                                                    <span className="text-xs text-muted">· {day.focus}</span>
                                                </div>
                                                <div className="space-y-2">
                                                    {day.exercises?.map((ex: any) => (
                                                        <ExerciseCard key={ex.name} exercise={ex} />
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modals */}
            <ConfirmationModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Delete Plan?"
                description="This plan will be permanently removed. This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Keep"
                variant="danger"
                loading={actionLoading}
            />
            <ConfirmationModal
                isOpen={!!restoreTarget}
                onClose={() => setRestoreTarget(null)}
                onConfirm={handleRestore}
                title="Restore This Plan?"
                description="This plan will become your active training plan. Your current plan will remain in the list."
                confirmLabel="Restore"
                cancelLabel="Cancel"
                variant="warning"
                loading={actionLoading}
            />
        </div>
    );
}

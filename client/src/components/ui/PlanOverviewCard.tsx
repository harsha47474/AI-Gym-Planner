import React from "react";
import { Target, Calendar, Repeat, StickyNote, TrendingUp, Clock } from "lucide-react";
import type { TrainingPlan } from "../../types";

interface PlanOverviewCardProps {
    plan: TrainingPlan;
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors">
            <div className="w-8 h-8 rounded-lg red-gradient flex items-center justify-center shrink-0 mt-0.5 shadow-sm shadow-red-500/20">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-xs text-muted font-medium uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-sm text-white font-medium leading-relaxed">{value}</p>
            </div>
        </div>
    );
}

export default function PlanOverviewCard({ plan }: PlanOverviewCardProps) {
    const { overview, progression, createdAt, version } = plan;

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="glass rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-white">AI Training Plan</h2>
                        <p className="text-xs text-muted mt-0.5">Your personalized workout blueprint</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/20">
                            v{version}
                        </span>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-3">
                <InfoRow
                    icon={<Target size={14} className="text-white" />}
                    label="Goal"
                    value={overview.goal}
                />
                <InfoRow
                    icon={<Repeat size={14} className="text-white" />}
                    label="Split"
                    value={overview.split.replace(/_/g, " / ")}
                />
                <InfoRow
                    icon={<Calendar size={14} className="text-white" />}
                    label="Frequency"
                    value={overview.frequency}
                />
                <InfoRow
                    icon={<TrendingUp size={14} className="text-white" />}
                    label="Progression"
                    value={progression}
                />
                <InfoRow
                    icon={<StickyNote size={14} className="text-white" />}
                    label="Notes"
                    value={overview.notes}
                />
                <InfoRow
                    icon={<Clock size={14} className="text-white" />}
                    label="Generated On"
                    value={formatDate(createdAt)}
                />
            </div>
        </div>
    );
}

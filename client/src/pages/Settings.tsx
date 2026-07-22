import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Settings as SettingsIcon, Scale, Bell, BellOff, StickyNote, Save, CheckCircle2 } from "lucide-react";
import type { UserSettings } from "../types";
import clsx from "clsx";

const DEFAULT_SETTINGS: UserSettings = {
    units: "kg",
    remindersEnabled: false,
    reminderTime: "08:00",
    regenerateNotes: "",
};

function loadSettings(): UserSettings {
    try {
        return JSON.parse(localStorage.getItem("userSettings") || "null") ?? DEFAULT_SETTINGS;
    } catch {
        return DEFAULT_SETTINGS;
    }
}

function ToggleSwitch({ checked, onChange, id }: { checked: boolean; onChange: (val: boolean) => void; id: string }) {
    return (
        <button
            id={id}
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={clsx(
                "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300",
                checked ? "red-gradient" : "bg-white/10"
            )}
        >
            <span className={clsx(
                "inline-block h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300",
                checked ? "translate-x-5.5" : "translate-x-0.5"
            )} />
        </button>
    );
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="glass rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/8 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg red-gradient flex items-center justify-center shadow-sm shadow-red-500/20">
                    {icon}
                </div>
                <h2 className="font-bold text-white text-sm">{title}</h2>
            </div>
            <div className="p-5 space-y-4">{children}</div>
        </div>
    );
}

export default function Settings() {
    const { user, loading } = useAuth();
    const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setSettings(loadSettings());
    }, []);

    if (!user && !loading) return <Navigate to="/auth/sign-in" replace />;

    const update = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setSaved(false);
    };

    const handleSave = () => {
        localStorage.setItem("userSettings", JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const handleNotificationToggle = async (val: boolean) => {
        if (val && "Notification" in window) {
            const permission = await Notification.requestPermission();
            if (permission !== "granted") {
                update("remindersEnabled", false);
                return;
            }
        }
        update("remindersEnabled", val);
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Settings</h1>
                <p className="text-muted mt-1 text-sm">Customize your fitness experience</p>
            </div>

            {/* Saved banner */}
            {saved && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
                    <CheckCircle2 size={18} />
                    Settings saved!
                </div>
            )}

            {/* Units */}
            <SectionCard title="Units" icon={<Scale size={14} className="text-white" />}>
                <div>
                    <p className="text-sm text-muted mb-3">Choose your preferred weight unit</p>
                    <div className="flex gap-3">
                        {(["kg", "lbs"] as const).map((unit) => (
                            <button
                                key={unit}
                                id={`unit-${unit}`}
                                onClick={() => update("units", unit)}
                                className={clsx(
                                    "flex-1 py-3 rounded-xl text-sm font-semibold border transition-all duration-200",
                                    settings.units === unit
                                        ? "red-gradient text-white border-transparent shadow-lg shadow-red-500/20"
                                        : "glass text-muted border-white/10 hover:text-white hover:border-red-500/20"
                                )}
                            >
                                {unit.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </SectionCard>

            {/* Reminders */}
            <SectionCard title="Workout Reminders" icon={<Bell size={14} className="text-white" />}>
                <div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-white">Enable Reminders</p>
                            <p className="text-xs text-muted mt-0.5">Get notified before your workout</p>
                        </div>
                        <ToggleSwitch
                            id="reminders-toggle"
                            checked={settings.remindersEnabled}
                            onChange={handleNotificationToggle}
                        />
                    </div>

                    {settings.remindersEnabled && (
                        <div className="mt-4 space-y-2">
                            <label htmlFor="reminder-time" className="text-xs text-muted font-medium uppercase tracking-wider">
                                Reminder Time
                            </label>
                            <input
                                id="reminder-time"
                                type="time"
                                value={settings.reminderTime}
                                onChange={e => update("reminderTime", e.target.value)}
                                className="w-full glass rounded-xl px-4 py-3 text-sm text-white bg-transparent border border-white/10 focus:border-red-500/40 focus:outline-none transition-colors"
                            />
                        </div>
                    )}

                    {!settings.remindersEnabled && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-muted">
                            <BellOff size={12} />
                            <span>Reminders are disabled</span>
                        </div>
                    )}
                </div>
            </SectionCard>

            {/* Regenerate preferences */}
            <SectionCard
                title="Regenerate Preferences"
                icon={<StickyNote size={14} className="text-white" />}
            >
                <div>
                    <label htmlFor="regen-notes" className="text-xs text-muted font-medium uppercase tracking-wider block mb-2">
                        Notes for next plan generation
                    </label>
                    <textarea
                        id="regen-notes"
                        rows={4}
                        value={settings.regenerateNotes}
                        onChange={e => update("regenerateNotes", e.target.value)}
                        placeholder="e.g. I want more focus on glutes, less cardio, prefer compound movements only..."
                        className="w-full glass rounded-xl px-4 py-3 text-sm text-white bg-transparent border border-white/10 focus:border-red-500/40 focus:outline-none transition-colors resize-none placeholder:text-white/20"
                    />
                    <p className="text-xs text-muted mt-1.5">These notes will be considered when you regenerate your AI plan.</p>
                </div>
            </SectionCard>

            {/* Save button */}
            <button
                id="save-settings-btn"
                onClick={handleSave}
                className="w-full py-4 rounded-2xl red-gradient text-white font-bold text-sm shadow-xl shadow-red-500/20 hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
                <Save size={16} />
                Save Settings
            </button>

            {/* App info */}
            <div className="glass rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-bold text-muted uppercase tracking-wider">About</h3>
                <div className="flex justify-between text-sm">
                    <span className="text-muted">App</span>
                    <span className="text-white font-medium">FormaAI</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted">Version</span>
                    <span className="text-white font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted">User ID</span>
                    <span className="text-white/60 font-mono text-xs truncate ml-4">{user?.id?.slice(0, 16)}…</span>
                </div>
            </div>
        </div>
    );
}

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, X } from "lucide-react";
import clsx from "clsx";

interface RestTimerProps {
    defaultSeconds?: number;
    onClose?: () => void;
    isOpen: boolean;
}

export default function RestTimer({ defaultSeconds = 120, onClose, isOpen }: RestTimerProps) {
    const [seconds, setSeconds] = useState(defaultSeconds);
    const [running, setRunning] = useState(false);
    const [total] = useState(defaultSeconds);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (isOpen) {
            setSeconds(defaultSeconds);
            setRunning(false);
        }
    }, [isOpen, defaultSeconds]);

    useEffect(() => {
        if (running && seconds > 0) {
            intervalRef.current = setInterval(() => {
                setSeconds((s) => {
                    if (s <= 1) {
                        setRunning(false);
                        clearInterval(intervalRef.current!);
                        return 0;
                    }
                    return s - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [running, seconds]);

    const reset = () => {
        setRunning(false);
        setSeconds(defaultSeconds);
    };

    const progress = total > 0 ? ((total - seconds) / total) * 100 : 100;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const strokeDash = circumference - (progress / 100) * circumference;

    const timerColor = seconds === 0
        ? "#22c55e"
        : seconds < 15
            ? "#f21313"
            : seconds < 30
                ? "#f97316"
                : "#f21313";

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div
                className="glass relative w-full max-w-sm rounded-2xl p-6 border border-white/10 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-white hover:bg-white/10 transition-all"
                >
                    <X size={16} />
                </button>

                <h3 className="text-center font-bold text-white mb-6">Rest Timer</h3>

                {/* SVG Ring */}
                <div className="flex justify-center mb-6">
                    <div className="relative w-36 h-36">
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 128 128">
                            {/* Track */}
                            <circle
                                cx="64" cy="64" r={radius}
                                fill="none"
                                stroke="rgba(255,255,255,0.08)"
                                strokeWidth="8"
                            />
                            {/* Progress */}
                            <circle
                                cx="64" cy="64" r={radius}
                                fill="none"
                                stroke={timerColor}
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDash}
                                style={{ transition: "stroke-dashoffset 0.5s ease, stroke 0.3s ease" }}
                            />
                        </svg>
                        {/* Time display */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-white tabular-nums">
                                {String(minutes).padStart(2, "0")}:{String(secs).padStart(2, "0")}
                            </span>
                            <span className="text-xs text-muted mt-0.5">
                                {seconds === 0 ? "Done!" : "remaining"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Preset buttons */}
                <div className="flex gap-2 mb-4 justify-center">
                    {[30, 60, 90, 120, 180].map((s) => (
                        <button
                            key={s}
                            onClick={() => { setSeconds(s); setRunning(false); }}
                            className={clsx(
                                "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
                                seconds === s && !running
                                    ? "red-gradient text-white"
                                    : "bg-white/5 text-muted hover:bg-white/10 hover:text-white"
                            )}
                        >
                            {s >= 60 ? `${s / 60}m` : `${s}s`}
                        </button>
                    ))}
                </div>

                {/* Controls */}
                <div className="flex gap-3">
                    <button
                        onClick={reset}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-muted hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
                    >
                        <RotateCcw size={15} /> Reset
                    </button>
                    <button
                        onClick={() => setRunning((r) => !r)}
                        className={clsx(
                            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all",
                            running
                                ? "bg-white/10 border border-white/20 text-white"
                                : "red-gradient text-white shadow-lg shadow-red-500/20"
                        )}
                    >
                        {running ? <><Pause size={15} /> Pause</> : <><Play size={15} /> Start</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

import React, { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import Button from "./Button";
import clsx from "clsx";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "danger" | "warning" | "default";
    loading?: boolean;
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = "danger",
    loading = false,
}: ConfirmationModalProps) {
    // Lock scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="glass relative w-full max-w-md rounded-2xl p-6 shadow-2xl shadow-black/50 border border-white/10 animate-[fadeInScale_0.2s_ease-out]"
                onClick={(e) => e.stopPropagation()}
                style={{ animation: "fadeInScale 0.2s ease-out" }}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-white hover:bg-white/10 transition-all"
                >
                    <X size={16} />
                </button>

                {/* Icon */}
                <div className={clsx(
                    "mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl",
                    variant === "danger" && "bg-red-500/15 border border-red-500/20",
                    variant === "warning" && "bg-yellow-500/15 border border-yellow-500/20",
                    variant === "default" && "bg-white/10 border border-white/10",
                )}>
                    <AlertTriangle
                        size={28}
                        className={clsx(
                            variant === "danger" && "text-red-400",
                            variant === "warning" && "text-yellow-400",
                            variant === "default" && "text-white",
                        )}
                    />
                </div>

                {/* Content */}
                <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{description}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <Button
                        variant="ghost"
                        className="flex-1 border border-white/10"
                        onClick={onClose}
                        disabled={loading}
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        variant="primary"
                        className="flex-1"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2 justify-center">
                                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                Processing...
                            </span>
                        ) : confirmLabel}
                    </Button>
                </div>
            </div>

            <style>{`
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
}

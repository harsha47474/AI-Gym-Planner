import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export default function Input({
    label,
    className,
    ...props
}: InputProps) {
    return (
        <div className="w-full">
            <label className="mb-2 block text-sm font-medium text-muted">
                {label}
            </label>

            <input
                {...props}
                className={cn(
                    "glass w-full rounded-xl px-4 py-3 outline-none transition-all duration-300",
                    "focus:border-red-500",
                    className
                )}
            />
        </div>
    );
}
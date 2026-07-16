import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

interface OptionCardProps {
  title: string;
  description?: string;
  selected?: boolean;
  onClick?: () => void;
}

export default function OptionCard({
  title,
  description,
  selected = false,
  onClick,
}: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "glass w-full rounded-2xl p-5 text-left transition-all duration-300",
        selected
          ? "border-red-500 scale-[1.02]"
          : "hover:border-red-500 hover:-translate-y-1"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>

          {description && (
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--muted)" }}
            >
              {description}
            </p>
          )}
        </div>

        {selected && (
          <div className="red-gradient flex h-7 w-7 items-center justify-center rounded-full">
            <Check className="h-4 w-4 text-white" />
          </div>
        )}
      </div>
    </button>
  );
}
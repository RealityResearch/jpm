// src/components/ui/Progress.tsx
"use client";
import { cn } from "@/lib/utils";

type Props = { value: number; className?: string };

export function Progress({ value, className }: Props) {
  return (
    <div
      className={cn("h-2 w-full bg-neutral-200 rounded-full", className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-emerald-600 rounded-full transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
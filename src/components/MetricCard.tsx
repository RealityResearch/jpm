"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  primary: string | number;
  secondary?: string;
  loading?: boolean;
  className?: string;
};

export default function MetricCard({ label, primary, secondary, loading, className }: Props) {
  return (
    <Card className={cn("border-neutral-200 bg-white/60", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-neutral-600">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-tight text-neutral-900">
          {loading ? "—" : primary}
        </div>
        {secondary ? (
          <div className="text-xs text-neutral-500">{secondary}</div>
        ) : null}
      </CardContent>
    </Card>
  );
}

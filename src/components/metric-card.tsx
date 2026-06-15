import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MetricCard({ title, value, icon: Icon, tone = "neutral", caption }: { title: string; value: string; icon: LucideIcon; tone?: "neutral" | "profit" | "loss" | "accent"; caption?: string }) {
  const tones = {
    neutral: "text-foreground",
    profit: "text-profit",
    loss: "text-loss",
    accent: "text-accent",
  };

  return (
    <Card title={caption ?? title}>
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
        <CardTitle className="text-muted-foreground">{title}</CardTitle>
        <Icon className={cn("h-4 w-4", tones[tone])} />
      </CardHeader>
      <CardContent>
        <div className={cn("truncate text-2xl font-semibold", tones[tone])}>{value}</div>
        {caption && <div className={cn("mt-1 truncate text-xs", tone === "profit" ? "text-profit" : "text-muted-foreground")}>{caption}</div>}
      </CardContent>
    </Card>
  );
}

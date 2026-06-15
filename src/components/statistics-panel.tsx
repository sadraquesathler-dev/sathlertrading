import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { DashboardMetrics } from "@/types/database";

export function StatisticsPanel({ metrics }: { metrics: DashboardMetrics }) {
  const items = [
    ["Total de dias operados", metrics.operatedDays],
    ["Dias positivos", metrics.positiveDays],
    ["Dias negativos", metrics.negativeDays],
    ["Taxa de acerto", formatPercent(metrics.winRate)],
    ["Fator de lucro", metrics.profitFactor.toFixed(2)],
    ["Média dos ganhos", formatCurrency(metrics.averageGain)],
    ["Média das perdas", formatCurrency(metrics.averageLoss)],
    ["Melhor dia", formatCurrency(metrics.bestDay)],
    ["Pior dia", formatCurrency(metrics.worstDay)],
    ["Seq. máxima de ganhos", metrics.maxWinStreak],
    ["Seq. máxima de perdas", metrics.maxLossStreak],
  ];

  return (
    <Card>
      <CardHeader><CardTitle>Estatísticas</CardTitle></CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-2">
          {items.map(([label, value]) => (
            <div key={String(label)} className="rounded-md border border-border bg-secondary/25 p-3">
              <div className="text-xs text-muted-foreground">{label}</div>
              <div className="mt-1 truncate text-lg font-semibold">{value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

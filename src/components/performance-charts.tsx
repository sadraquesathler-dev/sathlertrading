"use client";

import { Area, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { LineChart as LineChartIcon } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildEquityCurve, buildProjection } from "@/lib/calculations";
import { formatCurrency } from "@/lib/format";
import type { TradeResult } from "@/types/database";

export function PerformanceCharts({ results }: { results: TradeResult[] }) {
  const equity = buildEquityCurve(results);
  const projection = buildProjection(results);
  const tooltipFormatter = (value: string | number) => formatCurrency(Number(value));

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Curva de Capital</CardTitle></CardHeader>
        <CardContent className="h-80">
          {equity.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={equity} margin={{ left: 0, right: 12, top: 12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(value) => `${Number(value) / 1000}k`} />
                <Tooltip formatter={tooltipFormatter} contentStyle={{ background: "#101722", border: "1px solid #263241", borderRadius: 8 }} />
                <Line type="monotone" dataKey="accumulated" name="Resultado acumulado" stroke="#18d27f" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState icon={LineChartIcon} title="Sem operações no mês" description="Cadastre um resultado no calendário para iniciar a curva de capital." />
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Projeção até o fim do mês</CardTitle></CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={projection} margin={{ left: 0, right: 12, top: 12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(value) => `${Number(value) / 1000}k`} />
              <Tooltip formatter={tooltipFormatter} contentStyle={{ background: "#101722", border: "1px solid #263241", borderRadius: 8 }} />
              <Legend />
              <Area type="monotone" dataKey="otimista" fill="rgba(65,181,255,.08)" stroke="none" />
              <Line type="monotone" dataKey="conservador" name="Conservador" stroke="#f5b94f" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="realista" name="Realista" stroke="#18d27f" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="otimista" name="Otimista" stroke="#41b5ff" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

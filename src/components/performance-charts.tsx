"use client";

import { LineChart as LineChartIcon } from "lucide-react";
import { Area, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildEquityCurve, buildProjection } from "@/lib/calculations";
import { formatCurrency } from "@/lib/format";
import type { TradeResult } from "@/types/database";

const tooltipStyle = {
  background: "rgba(10, 12, 32, .92)",
  border: "1px solid rgba(25,230,255,.24)",
  borderRadius: 8,
  boxShadow: "0 0 38px rgba(168,85,255,.28)",
};

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
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(168,85,255,.2)" />
                <XAxis dataKey="date" stroke="#9fb2d8" fontSize={12} />
                <YAxis stroke="#9fb2d8" fontSize={12} tickFormatter={(value) => `${Number(value) / 1000}k`} />
                <Tooltip formatter={tooltipFormatter} contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="accumulated" name="Resultado acumulado" stroke="#00e7ff" strokeWidth={3.2} dot={{ r: 3, fill: "#00e7ff" }} />
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
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(168,85,255,.2)" />
              <XAxis dataKey="date" stroke="#9fb2d8" fontSize={12} />
              <YAxis stroke="#9fb2d8" fontSize={12} tickFormatter={(value) => `${Number(value) / 1000}k`} />
              <Tooltip formatter={tooltipFormatter} contentStyle={tooltipStyle} />
              <Legend />
              <Area type="monotone" dataKey="otimista" fill="rgba(168,85,255,.16)" stroke="none" />
              <Line type="monotone" dataKey="conservador" name="Conservador" stroke="#f5b94f" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="realista" name="Realista" stroke="#00e7ff" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="otimista" name="Otimista" stroke="#a855ff" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

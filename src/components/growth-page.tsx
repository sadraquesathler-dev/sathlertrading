"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Flag, LineChart as LineChartIcon, Target, TrendingUp, Wallet } from "lucide-react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricCard } from "@/components/metric-card";
import { useGrowthData } from "@/hooks/use-growth-data";
import { formatCurrency, formatPercent } from "@/lib/format";

export function GrowthPage() {
  const [initialCapital, setInitialCapital] = useState("100");
  const [targetCapital, setTargetCapital] = useState("10000");
  const { user, results, equityCurve, loading, error, signIn } = useGrowthData();
  const initial = Number(initialCapital || 0);
  const target = Number(targetCapital || 0);
  const currentEquity = initial + (equityCurve[equityCurve.length - 1]?.accumulated ?? 0);
  const distance = Math.max(target - currentEquity, 0);
  const progress = target > initial ? ((currentEquity - initial) / (target - initial)) * 100 : 0;
  const averageResult = results.length ? results.reduce((sum, item) => sum + Number(item.result_value), 0) / results.length : 0;
  const arrivalProjection = averageResult > 0 && distance > 0 ? `${Math.ceil(distance / averageResult)} operações` : distance === 0 ? "Objetivo atingido" : "Sem tendência positiva";

  const chartData = useMemo(() => {
    const steps = Math.max(12, equityCurve.length || 12);
    return Array.from({ length: steps + 1 }).map((_, index) => {
      const planned = initial + ((target - initial) / steps) * index;
      const realPoint = equityCurve[index - 1];
      return {
        point: index,
        planejada: planned,
        real: index === 0 ? initial : realPoint ? initial + realPoint.accumulated : null,
      };
    });
  }, [equityCurve, initial, target]);

  return (
    <main className="market-grid min-h-screen pb-10">
      <header className="border-b border-border/80 bg-background/82 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Button asChild variant="ghost"><Link href="/"><ArrowLeft className="h-4 w-4" />Painel</Link></Button>
          {!user && !loading && <Button onClick={signIn}><TrendingUp className="h-4 w-4" />Entrar</Button>}
        </div>
      </header>
      <div className="container space-y-6 pt-6">
        <div>
          <p className="text-sm uppercase text-muted-foreground">Crescimento da conta</p>
          <h1 className="text-3xl font-semibold tracking-normal">Curva planejada x real</h1>
        </div>
        {error && <div className="rounded-md border border-loss/40 bg-loss/10 px-3 py-2 text-sm text-loss">{error}</div>}
        <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
          <Card>
            <CardHeader><CardTitle>Objetivo financeiro</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Capital inicial</Label><Input type="number" step="0.01" value={initialCapital} onChange={(event) => setInitialCapital(event.target.value)} /></div>
              <div className="space-y-2"><Label>Objetivo financeiro</Label><Input type="number" step="0.01" value={targetCapital} onChange={(event) => setTargetCapital(event.target.value)} /></div>
            </CardContent>
          </Card>
          <div className="grid gap-4">
            {loading ? (
              <Skeleton className="h-28" />
            ) : (
              <section className="grid gap-4 sm:grid-cols-3">
                <MetricCard title="Percentual concluído" value={formatPercent(Math.max(0, Math.min(progress, 100)))} icon={Target} tone={progress >= 100 ? "profit" : "accent"} />
                <MetricCard title="Distância até o objetivo" value={formatCurrency(distance)} icon={Flag} tone={distance === 0 ? "profit" : "neutral"} />
                <MetricCard title="Projeção de chegada" value={arrivalProjection} icon={Wallet} tone={distance === 0 ? "profit" : "neutral"} />
              </section>
            )}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Curva de Crescimento</CardTitle><LineChartIcon className="h-4 w-4 text-primary" /></CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ left: 0, right: 12, top: 12, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" />
                    <XAxis dataKey="point" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(value) => `${Number(value) / 1000}k`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ background: "#101722", border: "1px solid #263241", borderRadius: 8 }} />
                    <Legend />
                    <Line type="monotone" dataKey="planejada" name="Curva planejada" stroke="#41b5ff" strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="real" name="Curva real" stroke="#18d27f" strokeWidth={2.5} dot={{ r: 3 }} connectNulls={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

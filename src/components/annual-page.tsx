"use client";

import Link from "next/link";
import { ArrowLeft, BarChart3, CalendarRange, Target, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricCard } from "@/components/metric-card";
import { EmptyState } from "@/components/empty-state";
import { useAnnualData } from "@/hooks/use-annual-data";
import { formatCurrency, formatPercent } from "@/lib/format";

export function AnnualPage() {
  const year = new Date().getFullYear();
  const { user, overview, loading, error, signIn } = useAnnualData(year);
  const total = overview.reduce((sum, item) => sum + item.result, 0);
  const monthsWithData = overview.filter((item) => item.result !== 0 || item.target !== 0);
  const bestMonth = overview.reduce((best, item) => (item.result > best.result ? item : best), overview[0]);
  const worstMonth = overview.reduce((worst, item) => (item.result < worst.result ? item : worst), overview[0]);

  return (
    <main className="cosmic-page min-h-screen pb-10">
      <div className="cosmic-nebula" />
      <div className="meteor-field" />
      <div className="planet-horizon" />
      <header className="border-b border-border/80 bg-background/82 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Button asChild variant="ghost"><Link href="/"><ArrowLeft className="h-4 w-4" />Painel</Link></Button>
          {!user && !loading && <Button onClick={signIn}><BarChart3 className="h-4 w-4" />Entrar</Button>}
        </div>
      </header>
      <div className="container space-y-6 pt-6">
        <div>
          <p className="text-sm uppercase text-muted-foreground">Painel anual</p>
          <h1 className="text-3xl font-semibold tracking-normal">{year}</h1>
        </div>
        {error && <div className="rounded-md border border-loss/40 bg-loss/10 px-3 py-2 text-sm text-loss">{error}</div>}
        {loading ? (
          <div className="space-y-4"><Skeleton className="h-28" /><Skeleton className="h-96" /></div>
        ) : monthsWithData.length ? (
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard title="Resultado acumulado" value={formatCurrency(total)} icon={Wallet} tone={total >= 0 ? "profit" : "loss"} />
              <MetricCard title="Melhor mês" value={`${bestMonth.monthLabel} ${formatCurrency(bestMonth.result)}`} icon={TrendingUp} tone="profit" />
              <MetricCard title="Pior mês" value={`${worstMonth.monthLabel} ${formatCurrency(worstMonth.result)}`} icon={TrendingDown} tone="loss" />
              <MetricCard title="Meses acompanhados" value={String(monthsWithData.length)} icon={CalendarRange} tone="accent" />
            </section>
            <Card>
              <CardHeader><CardTitle>Resultado x Objetivo por mês</CardTitle></CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={overview} margin={{ left: 0, right: 12, top: 12, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" />
                    <XAxis dataKey="monthLabel" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(value) => `${Number(value) / 1000}k`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ background: "#101722", border: "1px solid #263241", borderRadius: 8 }} />
                    <Legend />
                    <Bar dataKey="result" name="Resultado" fill="#18d27f" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="target" name="Objetivo" fill="#41b5ff" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Performance mensal</CardTitle></CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {overview.map((item) => (
                    <div key={item.month} className="rounded-md border border-border bg-secondary/25 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold">{item.monthLabel}</span>
                        <Target className="h-4 w-4 text-accent" />
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">Resultado {formatCurrency(item.result)}</div>
                      <div className="text-sm text-muted-foreground">Objetivo {formatCurrency(item.target)}</div>
                      <div className={item.achievement >= 100 ? "mt-2 text-profit" : "mt-2 text-foreground"}>{formatPercent(item.achievement)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <EmptyState icon={BarChart3} title="Sem dados anuais" description="Entre e registre objetivos ou operações para visualizar a performance por mês." />
        )}
      </div>
    </main>
  );
}

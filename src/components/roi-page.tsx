"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BadgePercent, LineChart as LineChartIcon, TrendingUp, Wallet } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MetricCard } from "@/components/metric-card";
import { formatCurrency, formatPercent } from "@/lib/format";

export function RoiPage() {
  const [initialCapital, setInitialCapital] = useState("10000");
  const [currentCapital, setCurrentCapital] = useState("12800");
  const initial = Number(initialCapital || 0);
  const current = Number(currentCapital || 0);
  const profit = current - initial;
  const roi = initial > 0 ? (profit / initial) * 100 : 0;

  const data = useMemo(() => {
    const steps = 12;
    return Array.from({ length: steps + 1 }).map((_, index) => ({
      point: index,
      capital: initial + (profit / steps) * index,
    }));
  }, [initial, profit]);

  return (
    <main className="cosmic-page min-h-screen pb-10">
      <div className="cosmic-nebula" />
      <div className="meteor-field" />
      <div className="planet-horizon" />
      <header className="border-b border-border/80 bg-background/82 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Button asChild variant="ghost"><Link href="/"><ArrowLeft className="h-4 w-4" />Painel</Link></Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><BadgePercent className="h-4 w-4 text-primary" />ROI</div>
        </div>
      </header>
      <div className="container space-y-6 pt-6">
        <div>
          <p className="text-sm uppercase text-muted-foreground">Painel de ROI</p>
          <h1 className="text-3xl font-semibold tracking-normal">Retorno sobre capital</h1>
        </div>
        <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
          <Card>
            <CardHeader><CardTitle>Capital</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Capital inicial</Label><Input type="number" step="0.01" value={initialCapital} onChange={(event) => setInitialCapital(event.target.value)} /></div>
              <div className="space-y-2"><Label>Capital atual</Label><Input type="number" step="0.01" value={currentCapital} onChange={(event) => setCurrentCapital(event.target.value)} /></div>
            </CardContent>
          </Card>
          <div className="grid gap-4">
            <section className="grid gap-4 sm:grid-cols-3">
              <MetricCard title="ROI" value={formatPercent(roi)} icon={BadgePercent} tone={roi >= 0 ? "profit" : "loss"} />
              <MetricCard title="Lucro absoluto" value={formatCurrency(profit)} icon={Wallet} tone={profit >= 0 ? "profit" : "loss"} />
              <MetricCard title="Crescimento acumulado" value={formatCurrency(current)} icon={TrendingUp} tone="accent" />
            </section>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Evolução</CardTitle><LineChartIcon className="h-4 w-4 text-primary" /></CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ left: 0, right: 12, top: 12, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" />
                    <XAxis dataKey="point" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(value) => `${Number(value) / 1000}k`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ background: "#101722", border: "1px solid #263241", borderRadius: 8 }} />
                    <Line type="monotone" dataKey="capital" name="Capital" stroke="#18d27f" strokeWidth={2.5} dot={false} />
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

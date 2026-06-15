"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calculator, TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency, formatPercent } from "@/lib/format";

export function SimulatorPage() {
  const [initialCapital, setInitialCapital] = useState("10000");
  const [roi, setRoi] = useState("1.5");
  const [operations, setOperations] = useState("30");

  const data = useMemo(() => {
    const start = Number(initialCapital || 0);
    const rate = Number(roi || 0) / 100;
    const total = Math.max(0, Math.floor(Number(operations || 0)));
    const points = [{ operation: 0, capital: start }];
    let capital = start;
    for (let index = 1; index <= total; index += 1) {
      capital *= 1 + rate;
      points.push({ operation: index, capital });
    }
    return points;
  }, [initialCapital, operations, roi]);

  const finalCapital = data[data.length - 1]?.capital ?? 0;
  const growth = Number(initialCapital) > 0 ? ((finalCapital - Number(initialCapital)) / Number(initialCapital)) * 100 : 0;

  return (
    <main className="market-grid min-h-screen pb-10">
      <header className="border-b border-border/80 bg-background/82 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Button asChild variant="ghost"><Link href="/"><ArrowLeft className="h-4 w-4" />Dashboard</Link></Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Calculator className="h-4 w-4 text-primary" />Simulador</div>
        </div>
      </header>
      <div className="container space-y-6 pt-6">
        <div>
          <p className="text-sm uppercase text-muted-foreground">Simulador de crescimento</p>
          <h1 className="text-3xl font-semibold tracking-normal">Projecao por ROI medio</h1>
        </div>
        <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
          <Card>
            <CardHeader><CardTitle>Parametros</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Capital inicial</Label><Input type="number" step="0.01" value={initialCapital} onChange={(event) => setInitialCapital(event.target.value)} /></div>
              <div className="space-y-2"><Label>ROI medio por operacao (%)</Label><Input type="number" step="0.01" value={roi} onChange={(event) => setRoi(event.target.value)} /></div>
              <div className="space-y-2"><Label>Numero de operacoes</Label><Input type="number" min="0" value={operations} onChange={(event) => setOperations(event.target.value)} /></div>
            </CardContent>
          </Card>
          <div className="grid gap-4">
            <section className="grid gap-4 sm:grid-cols-2">
              <Card><CardHeader><CardTitle>Capital final</CardTitle></CardHeader><CardContent className="text-3xl font-semibold text-profit">{formatCurrency(finalCapital)}</CardContent></Card>
              <Card><CardHeader><CardTitle>Crescimento percentual</CardTitle></CardHeader><CardContent className="text-3xl font-semibold text-accent">{formatPercent(growth)}</CardContent></Card>
            </section>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Evolucao do capital</CardTitle><TrendingUp className="h-4 w-4 text-primary" /></CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ left: 0, right: 12, top: 12, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" />
                    <XAxis dataKey="operation" stroke="#94a3b8" fontSize={12} />
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

"use client";

import { Activity, BadgeDollarSign, CalendarClock, Gauge, Landmark, LineChart, PiggyBank, ShieldCheck, Target, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { AuthPanel } from "@/components/auth-panel";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { GoalEditor } from "@/components/goal-editor";
import { MetricCard } from "@/components/metric-card";
import { PerformanceCharts } from "@/components/performance-charts";
import { StatisticsPanel } from "@/components/statistics-panel";
import { TradeCalendar } from "@/components/trade-calendar";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { getMonthLabel } from "@/lib/date-utils";
import { formatCurrency, formatPercent } from "@/lib/format";

export function DashboardShell() {
  const referenceDate = new Date();
  const { user, goal, results, metrics, loading, error, signIn, signInWithPassword, signUpWithPassword, signOut, saveGoal, saveTrade } = useDashboardData(referenceDate);

  if (!user && !loading) {
    return (
      <main className="market-grid min-h-screen">
        <AppHeader user={user} onSignIn={signIn} onSignOut={signOut} />
        <section className="container grid min-h-[calc(100vh-4rem)] items-center gap-8 py-10 lg:grid-cols-[1fr_420px]">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex rounded-md border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary">Performance financeira com dados privados</div>
            <h1 className="text-4xl font-semibold tracking-normal sm:text-6xl">Controle sua curva de capital com precisao profissional.</h1>
            <p className="max-w-2xl text-lg text-muted-foreground">Entre com email e senha ou Google para registrar operacoes, acompanhar metas mensais, analisar estatisticas e projetar cenarios ate o ultimo dia util do mes.</p>
          </div>
          <AuthPanel onGoogleSignIn={signIn} onPasswordSignIn={signInWithPassword} onPasswordSignUp={signUpWithPassword} />
        </section>
      </main>
    );
  }

  return (
    <main className="market-grid min-h-screen pb-10">
      <AppHeader user={user} onSignIn={signIn} onSignOut={signOut} />
      <div className="container space-y-6 pt-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase text-muted-foreground">Mesa operacional</p>
            <h1 className="text-3xl font-semibold capitalize tracking-normal">{getMonthLabel(referenceDate)}</h1>
          </div>
          {error && <div className="rounded-md border border-loss/40 bg-loss/10 px-3 py-2 text-sm text-loss">{error}</div>}
        </div>

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            <GoalEditor value={Number(goal?.target_value ?? 0)} onSave={saveGoal} />
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
              <MetricCard title="Resultado acumulado" value={formatCurrency(metrics.accumulated)} icon={Wallet} tone={metrics.accumulated >= 0 ? "profit" : "loss"} />
              <MetricCard title="Meta do mes" value={formatCurrency(metrics.target)} icon={Target} tone="accent" />
              <MetricCard title="Atingimento" value={formatPercent(metrics.achievement)} icon={Gauge} tone={metrics.achievement >= 100 ? "profit" : "neutral"} />
              <MetricCard title="Meta restante" value={formatCurrency(metrics.remainingGoal)} icon={PiggyBank} tone={metrics.goalReached ? "profit" : "neutral"} caption={metrics.goalReached ? "Meta atingida" : undefined} />
              <MetricCard title="Dias uteis restantes" value={String(metrics.remainingBusinessDays)} icon={CalendarClock} />
              <MetricCard title="Meta diaria necessaria" value={formatCurrency(metrics.requiredDailyGoal)} icon={BadgeDollarSign} tone={metrics.goalReached ? "profit" : "neutral"} caption={metrics.goalReached ? "Meta atingida" : "Exclui fins de semana e feriados"} />
              <MetricCard title="Media diaria" value={formatCurrency(metrics.averageDaily)} icon={Activity} tone={metrics.averageDaily >= 0 ? "profit" : "loss"} />
              <MetricCard title="Melhor dia" value={formatCurrency(metrics.bestDay)} icon={TrendingUp} tone="profit" />
              <MetricCard title="Pior dia" value={formatCurrency(metrics.worstDay)} icon={TrendingDown} tone="loss" />
              <MetricCard title="Operacoes" value={String(metrics.operatedDays)} icon={LineChart} />
              <MetricCard title="Equity atual" value={formatCurrency(metrics.currentEquity)} icon={Wallet} tone={metrics.currentEquity >= 0 ? "profit" : "loss"} />
              <MetricCard title="Equity maxima" value={formatCurrency(metrics.maxEquity)} icon={Landmark} tone="accent" />
              <MetricCard title="Drawdown atual" value={formatCurrency(metrics.currentDrawdown)} icon={TrendingDown} tone={metrics.currentDrawdown > 0 ? "loss" : "profit"} />
              <MetricCard title="Drawdown maximo" value={formatCurrency(metrics.maxDrawdown)} icon={ShieldCheck} tone={metrics.maxDrawdown > 0 ? "loss" : "profit"} />
            </section>
            <PerformanceCharts results={results} />
            <div className="grid gap-4 2xl:grid-cols-[1.1fr_.9fr]">
              <TradeCalendar referenceDate={referenceDate} results={results} onSave={saveTrade} />
              <StatisticsPanel metrics={metrics} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}

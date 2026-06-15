"use client";

import { Activity, BadgeDollarSign, BarChart3, CalendarClock, Gauge, Landmark, PiggyBank, ShieldCheck, Target, TrendingDown, TrendingUp, Wallet } from "lucide-react";
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
  const { user, goal, results, metrics, loading, error, signIn, signInWithPassword, signUpWithPassword, resetPasswordForEmail, signOut, saveGoal, saveTrade } = useDashboardData(referenceDate);

  if (!user && !loading) {
    return (
      <main className="cosmic-page min-h-screen">
        <div className="cosmic-nebula" />
        <div className="meteor-field" />
        <div className="planet-horizon" />
        <AppHeader user={user} onSignIn={signIn} onSignOut={signOut} />
        <section className="container grid min-h-[calc(100vh-5.25rem)] items-center gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_500px] lg:gap-14">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-3.5 py-2 text-sm text-slate-200 shadow-[0_14px_42px_rgba(0,0,0,.28)] backdrop-blur-xl">
              <ShieldCheck className="h-4 w-4 text-cyan-300" />
              Performance financeira com dados privados
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-normal text-white drop-shadow-[0_0_20px_rgba(0,0,0,.34)] sm:text-6xl lg:text-[64px]">
              Controle sua curva de capital com <span className="gradient-title">precisão profissional.</span>
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-300/85 sm:text-lg">
              Entre com email e senha ou Google para registrar operações, acompanhar objetivos mensais, analisar estatísticas e projetar cenários até o último dia útil do mês.
            </p>
          </div>
          <AuthPanel onGoogleSignIn={signIn} onPasswordSignIn={signInWithPassword} onPasswordSignUp={signUpWithPassword} onPasswordResetRequest={resetPasswordForEmail} />
        </section>
      </main>
    );
  }

  return (
    <main className="cosmic-page min-h-screen pb-10">
      <div className="cosmic-nebula" />
      <div className="meteor-field" />
      <div className="planet-horizon" />
      <AppHeader user={user} onSignIn={signIn} onSignOut={signOut} />
      <div className="container space-y-6 pt-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase text-muted-foreground">Mesa operacional</p>
            <h1 className="text-3xl font-semibold capitalize tracking-normal text-white">{getMonthLabel(referenceDate)}</h1>
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
              <MetricCard title="Objetivo Mensal" value={formatCurrency(metrics.target)} icon={Target} tone="accent" />
              <MetricCard title="Atingimento" value={formatPercent(metrics.achievement)} icon={Gauge} tone={metrics.achievement >= 100 ? "profit" : "neutral"} />
              <MetricCard title="Objetivo restante" value={formatCurrency(metrics.remainingGoal)} icon={PiggyBank} tone={metrics.goalReached ? "profit" : "neutral"} caption={metrics.goalReached ? "Objetivo atingido" : undefined} />
              <MetricCard title="Dias úteis restantes" value={String(metrics.remainingBusinessDays)} icon={CalendarClock} />
              <MetricCard title="Objetivo diário necessário" value={formatCurrency(metrics.requiredDailyGoal)} icon={BadgeDollarSign} tone={metrics.goalReached ? "profit" : "neutral"} caption={metrics.goalReached ? "Objetivo atingido" : "Exclui fins de semana e feriados"} />
              <MetricCard title="Média diária" value={formatCurrency(metrics.averageDaily)} icon={Activity} tone={metrics.averageDaily >= 0 ? "profit" : "loss"} />
              <MetricCard title="Melhor dia" value={formatCurrency(metrics.bestDay)} icon={TrendingUp} tone="profit" />
              <MetricCard title="Pior dia" value={formatCurrency(metrics.worstDay)} icon={TrendingDown} tone="loss" />
              <MetricCard title="Operações" value={String(metrics.operatedDays)} icon={BarChart3} />
              <MetricCard title="Capital atual" value={formatCurrency(metrics.currentEquity)} icon={Wallet} tone={metrics.currentEquity >= 0 ? "profit" : "loss"} />
              <MetricCard title="Capital máximo" value={formatCurrency(metrics.maxEquity)} icon={Landmark} tone="accent" />
              <MetricCard title="Drawdown atual" value={formatCurrency(metrics.currentDrawdown)} icon={TrendingDown} tone={metrics.currentDrawdown > 0 ? "loss" : "profit"} />
              <MetricCard title="Drawdown máximo" value={formatCurrency(metrics.maxDrawdown)} icon={ShieldCheck} tone={metrics.maxDrawdown > 0 ? "loss" : "profit"} />
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

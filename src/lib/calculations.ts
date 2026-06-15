import { addDays, compareAsc, endOfMonth, format, parseISO } from "date-fns";
import type { DashboardMetrics, MonthlyGoal, MonthlyOverview, TradeResult } from "@/types/database";
import { getBusinessDaysUntilEndOfMonth, getRemainingBusinessDays, isBusinessDay } from "./date-utils";

export function calculateMetrics(results: TradeResult[], target: number, referenceDate = new Date()): DashboardMetrics {
  const values = results.map((item) => Number(item.result_value));
  const accumulated = values.reduce((sum, value) => sum + value, 0);
  const positives = values.filter((value) => value > 0);
  const negatives = values.filter((value) => value < 0);
  const goalReached = target > 0 && accumulated >= target;
  const remainingGoal = Math.max(target - accumulated, 0);
  const remainingBusinessDays = getRemainingBusinessDays(referenceDate);
  const requiredDailyGoal = goalReached || remainingBusinessDays <= 0 ? 0 : remainingGoal / remainingBusinessDays;
  const operatedDays = values.length;
  const averageDaily = operatedDays > 0 ? accumulated / operatedDays : 0;
  const grossProfit = positives.reduce((sum, value) => sum + value, 0);
  const grossLoss = Math.abs(negatives.reduce((sum, value) => sum + value, 0));
  const drawdown = calculateDrawdown(results);

  return {
    accumulated,
    target,
    achievement: target > 0 ? (accumulated / target) * 100 : 0,
    remainingGoal,
    remainingBusinessDays,
    requiredDailyGoal,
    averageDaily,
    bestDay: values.length ? Math.max(...values) : 0,
    worstDay: values.length ? Math.min(...values) : 0,
    operatedDays,
    positiveDays: positives.length,
    negativeDays: negatives.length,
    winRate: operatedDays > 0 ? (positives.length / operatedDays) * 100 : 0,
    profitFactor: grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? grossProfit : 0,
    averageGain: positives.length ? grossProfit / positives.length : 0,
    averageLoss: negatives.length ? negatives.reduce((sum, value) => sum + value, 0) / negatives.length : 0,
    maxWinStreak: calculateMaxStreak(results, true),
    maxLossStreak: calculateMaxStreak(results, false),
    goalReached,
    currentEquity: drawdown.currentEquity,
    maxEquity: drawdown.maxEquity,
    currentDrawdown: drawdown.currentDrawdown,
    maxDrawdown: drawdown.maxDrawdown,
  };
}

export function calculateDrawdown(results: TradeResult[]) {
  const ordered = [...results].sort((a, b) => compareAsc(parseISO(a.trade_date), parseISO(b.trade_date)));
  let equity = 0;
  let maxEquity = 0;
  let maxDrawdown = 0;

  for (const result of ordered) {
    equity += Number(result.result_value);
    maxEquity = Math.max(maxEquity, equity);
    maxDrawdown = Math.max(maxDrawdown, maxEquity - equity);
  }

  return {
    currentEquity: equity,
    maxEquity,
    currentDrawdown: Math.max(maxEquity - equity, 0),
    maxDrawdown,
  };
}

function calculateMaxStreak(results: TradeResult[], positive: boolean) {
  const ordered = [...results].sort((a, b) => compareAsc(parseISO(a.trade_date), parseISO(b.trade_date)));
  let max = 0;
  let current = 0;
  for (const result of ordered) {
    const win = Number(result.result_value) > 0;
    const loss = Number(result.result_value) < 0;
    if ((positive && win) || (!positive && loss)) {
      current += 1;
      max = Math.max(max, current);
    } else if (Number(result.result_value) !== 0) {
      current = 0;
    }
  }
  return max;
}

export function buildEquityCurve(results: TradeResult[]) {
  const ordered = [...results].sort((a, b) => compareAsc(parseISO(a.trade_date), parseISO(b.trade_date)));
  let accumulated = 0;
  return ordered.map((result) => {
    accumulated += Number(result.result_value);
    return {
      date: format(parseISO(result.trade_date), "dd/MM"),
      accumulated,
    };
  });
}

export function buildProjection(results: TradeResult[], referenceDate = new Date()) {
  const metrics = calculateMetrics(results, 0, referenceDate);
  const businessDays = getBusinessDaysUntilEndOfMonth(referenceDate);
  const scenarios = buildProjectionScenarios(metrics.averageDaily);

  return businessDays.map((day, index) => {
    const projectedDays = index + 1;
    return scenarios.reduce(
      (entry, scenario) => ({
        ...entry,
        [scenario.key]: metrics.accumulated + scenario.daily * projectedDays,
      }),
      { date: format(day, "dd/MM") } as Record<string, string | number>,
    );
  });
}

function buildProjectionScenarios(averageDaily: number) {
  if (averageDaily > 0) {
    return [
      { key: "conservador", daily: averageDaily * 0.5 },
      { key: "realista", daily: averageDaily },
      { key: "otimista", daily: averageDaily * 1.5 },
    ] as const;
  }

  if (averageDaily < 0) {
    return [
      { key: "conservador", daily: averageDaily * 1.5 },
      { key: "realista", daily: averageDaily },
      { key: "otimista", daily: averageDaily * 0.5 },
    ] as const;
  }

  return [
    { key: "conservador", daily: 0 },
    { key: "realista", daily: 0 },
    { key: "otimista", daily: 0 },
  ] as const;
}

export function monthResults(results: TradeResult[], referenceDate: Date) {
  const start = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
  const end = endOfMonth(referenceDate);
  return results.filter((item) => {
    const date = parseISO(item.trade_date);
    return date >= start && date <= end && isBusinessDay(date);
  });
}

export function nextBusinessDate(date: Date) {
  let cursor = date;
  while (!isBusinessDay(cursor)) cursor = addDays(cursor, 1);
  return cursor;
}

export function buildAnnualOverview(results: TradeResult[], goals: MonthlyGoal[], year: number): MonthlyOverview[] {
  const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  return monthNames.map((monthLabel, index) => {
    const month = index + 1;
    const monthlyResult = results
      .filter((item) => {
        const date = parseISO(item.trade_date);
        return date.getFullYear() === year && date.getMonth() + 1 === month && isBusinessDay(date);
      })
      .reduce((sum, item) => sum + Number(item.result_value), 0);
    const target = Number(goals.find((goal) => goal.year === year && goal.month === month)?.target_value ?? 0);
    return {
      month,
      monthLabel,
      result: monthlyResult,
      target,
      achievement: target > 0 ? (monthlyResult / target) * 100 : 0,
    };
  });
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { calculateMetrics, monthResults } from "@/lib/calculations";
import { createClient } from "@/lib/supabase/client";
import { getCurrentUser, getMonthlyGoal, getTradeResults, upsertMonthlyGoal, upsertTradeResult } from "@/services/trades";
import type { MonthlyGoal, TradeResult, TradeResultInput } from "@/types/database";

export function useDashboardData(referenceDate: Date) {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [goal, setGoal] = useState<MonthlyGoal | null>(null);
  const [results, setResults] = useState<TradeResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const month = referenceDate.getMonth() + 1;
  const year = referenceDate.getFullYear();

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const currentUser = await getCurrentUser(supabase);
      setUser(currentUser);
      if (!currentUser) {
        setGoal(null);
        setResults([]);
        return;
      }
      const [goalData, tradeData] = await Promise.all([
        getMonthlyGoal(supabase, currentUser, month, year),
        getTradeResults(supabase, currentUser, month, year),
      ]);
      setGoal(goalData);
      setResults(tradeData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao carregar os dados.");
    } finally {
      setLoading(false);
    }
  }, [month, supabase, year]);

  useEffect(() => {
    refresh();
    const { data } = supabase.auth.onAuthStateChange(() => refresh());
    return () => data.subscription.unsubscribe();
  }, [refresh, supabase]);

  const saveGoal = useCallback(async (value: number) => {
    if (!user) return;
    const saved = await upsertMonthlyGoal(supabase, user, month, year, value);
    setGoal(saved);
  }, [month, supabase, user, year]);

  const saveTrade = useCallback(async (input: TradeResultInput) => {
    if (!user) return;
    await upsertTradeResult(supabase, user, input);
    await refresh();
  }, [refresh, supabase, user]);

  const signIn = useCallback(async () => {
    const origin = window.location.origin;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${origin}/auth/callback` },
    });
  }, [supabase]);

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) throw authError;
    await refresh();
  }, [refresh, supabase]);

  const signUpWithPassword = useCallback(async (email: string, password: string) => {
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (authError) throw authError;
    await refresh();
  }, [refresh, supabase]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setGoal(null);
    setResults([]);
  }, [supabase]);

  const filteredResults = useMemo(() => monthResults(results, referenceDate), [referenceDate, results]);
  const metrics = useMemo(() => calculateMetrics(filteredResults, Number(goal?.target_value ?? 0), referenceDate), [filteredResults, goal, referenceDate]);

  return { user, goal, results: filteredResults, metrics, loading, error, signIn, signInWithPassword, signUpWithPassword, signOut, saveGoal, saveTrade, refresh };
}

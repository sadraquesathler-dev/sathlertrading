"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { buildAnnualOverview } from "@/lib/calculations";
import { createClient } from "@/lib/supabase/client";
import { getAnnualGoals, getCurrentUser, getTradeResultsRange } from "@/services/trades";
import type { MonthlyGoal, MonthlyOverview, TradeResult } from "@/types/database";

export function useAnnualData(year: number) {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [goals, setGoals] = useState<MonthlyGoal[]>([]);
  const [results, setResults] = useState<TradeResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const currentUser = await getCurrentUser(supabase);
      setUser(currentUser);
      if (!currentUser) {
        setGoals([]);
        setResults([]);
        return;
      }
      const [goalData, resultData] = await Promise.all([
        getAnnualGoals(supabase, currentUser, year),
        getTradeResultsRange(supabase, currentUser, `${year}-01-01`, `${year}-12-31`),
      ]);
      setGoals(goalData);
      setResults(resultData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao carregar o painel anual.");
    } finally {
      setLoading(false);
    }
  }, [supabase, year]);

  useEffect(() => {
    refresh();
    const { data } = supabase.auth.onAuthStateChange(() => refresh());
    return () => data.subscription.unsubscribe();
  }, [refresh, supabase]);

  const overview: MonthlyOverview[] = useMemo(() => buildAnnualOverview(results, goals, year), [goals, results, year]);

  const signIn = useCallback(async () => {
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth/callback` } });
  }, [supabase]);

  return { user, goals, results, overview, loading, error, signIn };
}

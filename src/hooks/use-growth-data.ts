"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { buildEquityCurve } from "@/lib/calculations";
import { createClient } from "@/lib/supabase/client";
import { getAllTradeResults, getCurrentUser } from "@/services/trades";
import type { TradeResult } from "@/types/database";

export function useGrowthData() {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
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
        setResults([]);
        return;
      }
      setResults(await getAllTradeResults(supabase, currentUser));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao carregar a evolução real.");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    refresh();
    const { data } = supabase.auth.onAuthStateChange(() => refresh());
    return () => data.subscription.unsubscribe();
  }, [refresh, supabase]);

  const equityCurve = useMemo(() => buildEquityCurve(results), [results]);

  const signIn = useCallback(async () => {
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth/callback` } });
  }, [supabase]);

  return { user, results, equityCurve, loading, error, signIn };
}

import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database, MonthlyGoal, TradeResult, TradeResultInput } from "@/types/database";

export async function getCurrentUser(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}

export async function getMonthlyGoal(supabase: SupabaseClient<Database>, user: User, month: number, year: number) {
  const { data, error } = await supabase
    .from("monthly_goals")
    .select("*")
    .eq("user_id", user.id)
    .eq("month", month)
    .eq("year", year)
    .maybeSingle();
  if (error) throw error;
  return data as MonthlyGoal | null;
}

export async function upsertMonthlyGoal(supabase: SupabaseClient<Database>, user: User, month: number, year: number, targetValue: number) {
  const { data, error } = await supabase
    .from("monthly_goals")
    .upsert({ user_id: user.id, month, year, target_value: targetValue }, { onConflict: "user_id,month,year" })
    .select()
    .single();
  if (error) throw error;
  return data as MonthlyGoal;
}

export async function getTradeResults(supabase: SupabaseClient<Database>, user: User, month: number, year: number) {
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const end = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  const { data, error } = await supabase
    .from("trade_results")
    .select("*")
    .eq("user_id", user.id)
    .gte("trade_date", start)
    .lte("trade_date", end)
    .order("trade_date", { ascending: true });
  if (error) throw error;
  return (data ?? []) as TradeResult[];
}

export async function getAnnualGoals(supabase: SupabaseClient<Database>, user: User, year: number) {
  const { data, error } = await supabase
    .from("monthly_goals")
    .select("*")
    .eq("user_id", user.id)
    .eq("year", year)
    .order("month", { ascending: true });
  if (error) throw error;
  return (data ?? []) as MonthlyGoal[];
}

export async function getTradeResultsRange(supabase: SupabaseClient<Database>, user: User, start: string, end: string) {
  const { data, error } = await supabase
    .from("trade_results")
    .select("*")
    .eq("user_id", user.id)
    .gte("trade_date", start)
    .lte("trade_date", end)
    .order("trade_date", { ascending: true });
  if (error) throw error;
  return (data ?? []) as TradeResult[];
}

export async function getAllTradeResults(supabase: SupabaseClient<Database>, user: User) {
  const { data, error } = await supabase
    .from("trade_results")
    .select("*")
    .eq("user_id", user.id)
    .order("trade_date", { ascending: true });
  if (error) throw error;
  return (data ?? []) as TradeResult[];
}

export async function upsertTradeResult(supabase: SupabaseClient<Database>, user: User, input: TradeResultInput) {
  const { data, error } = await supabase
    .from("trade_results")
    .upsert(
      { user_id: user.id, trade_date: input.trade_date, result_value: input.result_value, notes: input.notes ?? null },
      { onConflict: "user_id,trade_date" },
    )
    .select()
    .single();
  if (error) throw error;
  return data as TradeResult;
}

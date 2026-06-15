export type MonthlyGoal = {
  id: string;
  user_id: string;
  month: number;
  year: number;
  target_value: number;
  created_at: string;
};

export type TradeResult = {
  id: string;
  user_id: string;
  trade_date: string;
  result_value: number;
  notes: string | null;
  created_at: string;
};

export type TradeResultInput = {
  trade_date: string;
  result_value: number;
  notes?: string | null;
};

export type Database = {
  public: {
    Tables: {
      monthly_goals: {
        Row: MonthlyGoal;
        Insert: Omit<MonthlyGoal, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Omit<MonthlyGoal, "id" | "created_at">>;
        Relationships: [];
      };
      trade_results: {
        Row: TradeResult;
        Insert: Omit<TradeResult, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Omit<TradeResult, "id" | "created_at">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type DashboardMetrics = {
  accumulated: number;
  target: number;
  achievement: number;
  remainingGoal: number;
  remainingBusinessDays: number;
  requiredDailyGoal: number;
  averageDaily: number;
  bestDay: number;
  worstDay: number;
  operatedDays: number;
  positiveDays: number;
  negativeDays: number;
  winRate: number;
  profitFactor: number;
  averageGain: number;
  averageLoss: number;
  maxWinStreak: number;
  maxLossStreak: number;
  goalReached: boolean;
  currentEquity: number;
  maxEquity: number;
  currentDrawdown: number;
  maxDrawdown: number;
};

export type MonthlyOverview = {
  month: number;
  monthLabel: string;
  result: number;
  target: number;
  achievement: number;
};

-- Execute este seed com um usuario autenticado. Ele usa auth.uid() para respeitar RLS.
insert into public.monthly_goals (user_id, month, year, target_value)
values (auth.uid(), extract(month from current_date)::int, extract(year from current_date)::int, 12000)
on conflict (user_id, month, year) do update set target_value = excluded.target_value;

insert into public.trade_results (user_id, trade_date, result_value, notes)
values
  (auth.uid(), date_trunc('month', current_date)::date + interval '1 day', 850, 'Setup de abertura com boa execucao.'),
  (auth.uid(), date_trunc('month', current_date)::date + interval '2 day', -320, 'Stop planejado; risco controlado.'),
  (auth.uid(), date_trunc('month', current_date)::date + interval '5 day', 1240, 'Tendencia forte no periodo da manha.'),
  (auth.uid(), date_trunc('month', current_date)::date + interval '8 day', 460, 'Operacoes curtas e disciplina no alvo.')
on conflict (user_id, trade_date) do update set
  result_value = excluded.result_value,
  notes = excluded.notes;

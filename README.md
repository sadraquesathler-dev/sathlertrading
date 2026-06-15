# Trade Performance Dashboard

Aplicacao web profissional para acompanhamento de performance financeira de trader, feita com Next.js 15, TypeScript, Tailwind CSS, Supabase, Recharts, Lucide Icons e componentes no padrao Shadcn/UI.

## Funcionalidades

- Login com Google via Supabase Auth.
- Dados isolados por usuario com RLS no Supabase.
- Dashboard mensal com resultado acumulado, meta, percentual, meta restante, dias uteis restantes, meta diaria necessaria, media diaria, melhor e pior dia.
- Equity Curve com resultado acumulado por data.
- Projecao conservadora, realista e otimista ate o ultimo dia util do mes.
- Calendario mensal com cadastro/edicao de resultado financeiro e observacoes.
- Estatisticas de operacao: win rate, profit factor, medias, sequencias e extremos.
- Simulador de crescimento em pagina separada.
- Dashboard anual em `/annual`, ROI em `/roi` e evolucao da conta em `/growth`.
- Dias uteis calculados com fins de semana e feriados brasileiros.
- Controle de drawdown atual e maximo no dashboard principal.
- Tema dark responsivo inspirado em dashboards financeiros profissionais.

## Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Configuracao Supabase

1. Crie um projeto no Supabase.
2. Copie `.env.example` para `.env.local` e preencha:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

3. No painel do Supabase, habilite Google em `Authentication > Providers > Google`.
4. Configure a URL de callback no Google Cloud e no Supabase:

```text
http://localhost:3000/auth/callback
```

Em producao, use tambem:

```text
https://seu-dominio.com/auth/callback
```

5. Execute as migrations em `supabase/migrations` no SQL Editor ou via Supabase CLI.
6. Opcionalmente execute `supabase/seed.sql` para criar dados de exemplo para o usuario autenticado atual.

## Estrutura

```text
src/app                 Rotas App Router
src/components          Componentes reutilizaveis
src/components/ui       Componentes estilo Shadcn/UI
src/hooks               Hooks da aplicacao
src/lib                 Supabase, formatadores, calculos e utilitarios
src/services            Consultas e mutations do Supabase
src/types               Tipos TypeScript
supabase/migrations     SQL de banco e RLS
supabase/seed.sql       Seed inicial
```

## Regras financeiras

- Sabados e domingos nao contam como dias uteis.
- Meta Restante = Meta Mensal - Resultado Acumulado.
- Meta Diaria Necessaria = Meta Restante / Dias Uteis Restantes.
- Percentual de Atingimento = Resultado Acumulado / Meta Mensal x 100.
- Cenarios de projecao: conservador 80%, realista 100%, otimista 120% da media diaria atual.

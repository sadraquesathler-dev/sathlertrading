# Painel de Performance de Trading

Aplicação web profissional para acompanhamento de performance financeira de trader, feita com Next.js 15, TypeScript, Tailwind CSS, Supabase, Recharts, Lucide Icons e componentes no padrão Shadcn/UI.

## Funcionalidades

- Login com Google via Supabase Auth.
- Dados isolados por usuário com RLS no Supabase.
- Painel mensal com resultado acumulado, objetivo mensal, percentual atingido, objetivo restante, dias úteis restantes, objetivo diário necessário, média diária, melhor e pior dia.
- Curva de Capital com resultado acumulado por data.
- Projeção conservadora, realista e otimista até o último dia útil do mês.
- Calendário mensal com cadastro/edição de resultado financeiro e observações.
- Estatísticas de operação: taxa de acerto, profit factor, médias, sequências e extremos.
- Simulador de crescimento em pagina separada.
- Painel anual em `/annual`, ROI em `/roi` e crescimento da conta em `/growth`.
- Dias úteis calculados com fins de semana e feriados brasileiros.
- Controle de drawdown atual e maximo no dashboard principal.
- Tema dark responsivo inspirado em dashboards financeiros profissionais.

## Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Configuração Supabase

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
6. Opcionalmente execute `supabase/seed.sql` para criar dados de exemplo para o usuário autenticado atual.

## Estrutura

```text
src/app                 Rotas App Router
src/components          Componentes reutilizáveis
src/components/ui       Componentes estilo Shadcn/UI
src/hooks               Hooks da aplicacao
src/lib                 Supabase, formatadores, cálculos e utilitários
src/services            Consultas e mutations do Supabase
src/types               Tipos TypeScript
supabase/migrations     SQL de banco e RLS
supabase/seed.sql       Seed inicial
```

## Regras financeiras

- Sábados e domingos não contam como dias úteis.
- Objetivo restante = Objetivo mensal - Resultado acumulado.
- Objetivo diário necessário = Objetivo restante / Dias úteis restantes.
- Percentual de atingimento = Resultado acumulado / Objetivo mensal x 100.
- Cenários de projeção: conservador 80%, realista 100%, otimista 120% da média diária atual.

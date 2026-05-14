# HantaWatch + Neon v1.2

Questa versione aggiunge Neon Postgres come database gratuito per salvare snapshot e dati normalizzati.

## Struttura

```text
api/
  monitor.js
  refresh.js
lib/
  db.js
  sources.js
  store.js
migrations/
  schema.sql
public/
  index.html
package.json
vercel.json
```

## 1. Installa dipendenze

```cmd
npm install
```

## 2. Crea il database Neon

Crea un progetto Neon e copia la connection string.

Usa preferibilmente la stringa pooled/serverless, se disponibile.

## 3. Crea le tabelle

Apri il SQL Editor di Neon e incolla il contenuto di:

```text
migrations/schema.sql
```

Eseguilo una volta.

## 4. Configura variabili locali

Crea un file `.env.local` nella root del progetto:

```env
DATABASE_URL="postgresql://..."
CRON_SECRET="scegli-una-stringa-lunga-casuale"
```

## 5. Avvio locale

```cmd
npx vercel dev
```

Apri:

```text
http://localhost:3000
```

## 6. Primo refresh locale

In locale `/api/refresh` è autorizzato senza secret:

```text
http://localhost:3000/api/refresh
```

Dovresti vedere un JSON con `ok: true`.

Poi apri:

```text
http://localhost:3000/api/monitor
```

A questo punto `/api/monitor` leggerà lo snapshot dal database.

## 7. Configura Vercel

Nel progetto Vercel aggiungi Environment Variables:

```text
DATABASE_URL
CRON_SECRET
```

Poi fai deploy:

```cmd
git add .
git commit -m "Add Neon database snapshots"
git push
```

## 8. Cron automatico

`vercel.json` contiene:

```json
{
  "crons": [
    {
      "path": "/api/refresh",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

Vercel chiamerà `/api/refresh` ogni 6 ore. Se `CRON_SECRET` è configurato, Vercel invierà il secret come header `Authorization: Bearer ...`.

## Query utili

Ultimo snapshot:

```sql
select id, year, generated_at, created_at
from monitor_snapshots
order by generated_at desc
limit 10;
```

Segnali più recenti:

```sql
select title, source, country_name, kind, published_at
from signals
order by published_at desc nulls last
limit 20;
```

Metriche Europa:

```sql
select country_name, value, rate
from country_metrics
where source_id = 'ecdc-aer-2023'
order by value desc nulls last;
```

Metriche USA settimanali:

```sql
select metric_week, value
from country_metrics
where source_id = 'cdc-nndss-weekly'
  and metric_type = 'official_surveillance_weekly_cases'
order by metric_week;
```

## Nota architetturale

La dashboard legge da `/api/monitor`.

- Se esiste uno snapshot nel database, usa quello.
- Se il database non è configurato o non c'è ancora uno snapshot, usa un fallback live.
- `/api/refresh` è l'endpoint che aggiorna il database.

# HantaWatch v4

Questa versione aggiunge funzioni prodotto sopra la base Neon.

## Novità

- `/api/history`: storico degli snapshot e variazioni rispetto allo snapshot precedente.
- `/api/status`: stato del database, conteggi, fonti e ultimi log.
- `/api/country?iso=XX`: scheda dati per paese.
- Scheda paese nel frontend cliccando sulla mappa.
- Sezione storico nella dashboard.
- Sezione stato del monitor nella dashboard.
- Pagina `/metodologia`.
- Cron giornaliero compatibile con Vercel Hobby.

## Avvio locale

```cmd
npm install
npx vercel dev
```

Refresh locale:

```text
http://localhost:3000/api/refresh
```

## Deploy

Imposta in Vercel, ambiente Production:

```text
DATABASE_URL
CRON_SECRET
```

Poi:

```cmd
git add .
git commit -m "Add HantaWatch v4 history status country drawer"
git push origin main
```

Refresh manuale online:

```cmd
curl -H "Authorization: Bearer IL_TUO_CRON_SECRET" https://TUO-DOMINIO.vercel.app/api/refresh
```

## Endpoint

```text
/api/monitor
/api/refresh
/api/history
/api/status
/api/country?iso=FI
/metodologia
```


## v4.1

Modifiche user-facing:

- rimossa dalla homepage la sezione tecnica "Stato del monitor";
- rimossi termini tecnici come snapshot/log/database dall'interfaccia principale;
- sostituita la sezione "Storico aggiornamenti" con "Andamento recente";
- aggiunto grafico "Avvisi nel tempo" basato sugli aggiornamenti salvati;
- mantenuti `/api/status` e `/api/history` nel backend, ma la dashboard usa solo dati adatti all'utente finale.


## v4.2

Modifiche user-centred:

- rimossa la card EU/EEA 2023 dalla fascia iniziale per evitare confusione con dati live;
- chiarita la card USA: "USA · casi cumulativi" e testo "Totale anno selezionato fino alla settimana CDC";
- l'andamento degli avvisi ora raggruppa i refresh per giorno, così i test manuali non sembrano aggiornamenti epidemiologici;
- la sezione Europa specifica meglio che si tratta di report annuale ECDC, non aggiornamento live.


## v4.3 Premium + SEO

Modifiche principali:

- UI più premium e coerente: max-width uniforme, tipografia 12/14/18/24/56, superfici leggere, ombre controllate, bordi sottili;
- nessun elemento tecnico nella homepage;
- meta title, description, canonical, Open Graph, Twitter Card;
- JSON-LD WebSite e Dataset in homepage;
- JSON-LD WebPage nella pagina metodologia;
- robots.txt e sitemap.xml in `public/`;
- pagina metodologia aggiornata con lo stesso linguaggio visivo della dashboard.

Se usi un dominio custom, aggiorna:
- `public/index.html`
- `public/metodologia.html`
- `public/robots.txt`
- `public/sitemap.xml`

sostituendo `https://hantavirusmonitor.vercel.app` con il dominio definitivo.


## v4.3.1

Fix routing:

- corretto `vercel.json`;
- `/metodologia` ora punta a `/metodologia.html`;
- `/` ora punta a `/index.html`;
- aggiunto `cleanUrls: true`.

const { getSql } = require('./db');
const { COUNTRY_META } = require('./sources');

async function insertFetchLog(sourceId, status, message = null) {
  const sql = getSql();
  if (!sql) return;

  await sql`
    insert into fetch_logs (source_id, status, message)
    values (${sourceId}, ${status}, ${message})
  `;
}

async function saveSources(data) {
  const sql = getSql();
  const sources = data.sources || [];

  for (const source of sources) {
    await sql`
      insert into sources (id, name, type, coverage, url, reliability, updated_at)
      values (
        ${source.id},
        ${source.name},
        ${source.type},
        ${source.coverage || null},
        ${source.url || null},
        ${source.reliability || 'unknown'},
        now()
      )
      on conflict (id) do update set
        name = excluded.name,
        type = excluded.type,
        coverage = excluded.coverage,
        url = excluded.url,
        reliability = excluded.reliability,
        updated_at = now()
    `;
  }
}

async function saveSnapshot(data, year) {
  const sql = getSql();
  const snapshot = JSON.stringify(data);

  const rows = await sql`
    insert into monitor_snapshots (year, generated_at, data)
    values (${year}, ${data.generatedAt}, ${snapshot}::jsonb)
    returning id
  `;

  return rows[0]?.id || null;
}

async function getLatestSnapshot(year) {
  const sql = getSql();
  if (!sql) return null;

  const rows = await sql`
    select data
    from monitor_snapshots
    where year = ${year}
    order by generated_at desc
    limit 1
  `;

  return rows[0]?.data || null;
}

async function saveEuropeMetrics(data) {
  const sql = getSql();
  const europe = data.official?.europe;
  if (!europe) return;

  for (const row of europe.countries || []) {
    if (row.status === 'no_data_reported') continue;

    const meta = COUNTRY_META[row.iso] || {};
    const metricHash = `ecdc-aer-2023:${row.iso}:${europe.year}:annual_cases`;

    await sql`
      insert into country_metrics (
        metric_hash,
        country_iso2,
        country_name,
        region,
        metric_type,
        metric_year,
        value,
        rate,
        source_id,
        source_url,
        raw
      )
      values (
        ${metricHash},
        ${row.iso},
        ${row.country},
        ${meta.region || 'Europa'},
        ${'official_surveillance_annual_cases'},
        ${europe.year},
        ${row.cases},
        ${row.rate},
        ${'ecdc-aer-2023'},
        ${europe.sourceUrl},
        ${JSON.stringify(row)}::jsonb
      )
      on conflict (metric_hash) do update set
        value = excluded.value,
        rate = excluded.rate,
        observed_at = now(),
        raw = excluded.raw
    `;
  }
}

async function saveUsaMetrics(data) {
  const sql = getSql();
  const usa = data.official?.usa;
  if (!usa) return;

  const ytdHash = `cdc-nndss-weekly:US:${usa.year}:week-${usa.latestWeek}:ytd`;

  await sql`
    insert into country_metrics (
      metric_hash,
      country_iso2,
      country_name,
      region,
      metric_type,
      metric_year,
      metric_week,
      value,
      source_id,
      source_url,
      raw
    )
    values (
      ${ytdHash},
      ${'US'},
      ${'Stati Uniti'},
      ${'Americhe'},
      ${'official_surveillance_ytd_cases'},
      ${usa.year},
      ${usa.latestWeek},
      ${usa.totalYtd},
      ${'cdc-nndss-weekly'},
      ${usa.sourceUrl},
      ${JSON.stringify(usa)}::jsonb
    )
    on conflict (metric_hash) do update set
      value = excluded.value,
      observed_at = now(),
      raw = excluded.raw
  `;

  for (const row of usa.weekly || []) {
    const weekHash = `cdc-nndss-weekly:US:${usa.year}:week-${row.week}:weekly_cases`;

    await sql`
      insert into country_metrics (
        metric_hash,
        country_iso2,
        country_name,
        region,
        metric_type,
        metric_year,
        metric_week,
        value,
        source_id,
        source_url,
        raw
      )
      values (
        ${weekHash},
        ${'US'},
        ${'Stati Uniti'},
        ${'Americhe'},
        ${'official_surveillance_weekly_cases'},
        ${usa.year},
        ${row.week},
        ${row.cases},
        ${'cdc-nndss-weekly'},
        ${usa.sourceUrl},
        ${JSON.stringify(row)}::jsonb
      )
      on conflict (metric_hash) do update set
        value = excluded.value,
        observed_at = now(),
        raw = excluded.raw
    `;
  }
}

async function saveEvents(data) {
  const sql = getSql();
  const events = data.official?.currentEvents || [];

  for (const event of events) {
    await sql`
      insert into events (
        id,
        title,
        disease,
        status,
        scope,
        last_updated_at,
        source_url,
        raw,
        updated_at
      )
      values (
        ${event.id},
        ${event.title},
        ${event.disease || null},
        ${event.status || null},
        ${event.scope || null},
        ${event.asOf || null},
        ${event.sourceUrl || null},
        ${JSON.stringify(event)}::jsonb,
        now()
      )
      on conflict (id) do update set
        title = excluded.title,
        disease = excluded.disease,
        status = excluded.status,
        scope = excluded.scope,
        last_updated_at = excluded.last_updated_at,
        source_url = excluded.source_url,
        raw = excluded.raw,
        updated_at = now()
    `;

    for (const item of event.timeline || []) {
      await sql`
        insert into event_updates (
          event_id,
          update_date,
          cases_total,
          confirmed,
          probable,
          deaths,
          summary,
          source_id,
          source_url,
          raw
        )
        values (
          ${event.id},
          ${item.date || event.asOf || null},
          ${event.casesTotal || null},
          ${event.confirmed || null},
          ${event.probable || null},
          ${event.deaths || null},
          ${item.detail || null},
          ${item.label?.toLowerCase().includes('who') ? 'who-don' : 'ecdc-andes-2026'},
          ${item.url || event.sourceUrl || null},
          ${JSON.stringify(item)}::jsonb
        )
        on conflict (event_id, update_date, source_url) do update set
          cases_total = excluded.cases_total,
          confirmed = excluded.confirmed,
          probable = excluded.probable,
          deaths = excluded.deaths,
          summary = excluded.summary,
          raw = excluded.raw
      `;
    }
  }
}

async function saveSignals(data) {
  const sql = getSql();
  const signals = data.signals?.items || [];

  for (const item of signals) {
    if (!item.title) continue;

    await sql`
      insert into signals (
        title,
        url,
        source,
        country_iso2,
        country_name,
        kind,
        published_at,
        raw,
        updated_at
      )
      values (
        ${item.title},
        ${item.url || null},
        ${item.source || null},
        ${item.countryIso2 || null},
        ${item.countryName || null},
        ${item.kind || null},
        ${item.publishedAt || null},
        ${JSON.stringify(item)}::jsonb,
        now()
      )
      on conflict (url) do update set
        title = excluded.title,
        source = excluded.source,
        country_iso2 = excluded.country_iso2,
        country_name = excluded.country_name,
        kind = excluded.kind,
        published_at = excluded.published_at,
        raw = excluded.raw,
        updated_at = now()
    `;
  }
}

async function persistMonitorData(data, year) {
  await saveSources(data);
  const snapshotId = await saveSnapshot(data, year);

  await saveEuropeMetrics(data);
  await saveUsaMetrics(data);
  await saveEvents(data);
  await saveSignals(data);

  await insertFetchLog('monitor', 'ok', `Snapshot ${snapshotId || 'unknown'} saved for year ${year}`);

  return { snapshotId };
}

module.exports = {
  persistMonitorData,
  getLatestSnapshot,
  insertFetchLog
};

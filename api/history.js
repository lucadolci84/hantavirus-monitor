const { hasDatabaseUrl, getSql } = require('../lib/db');

function parseYear(req) {
  const currentYear = new Date().getFullYear();
  const year = Number(req.query?.year || currentYear);
  return Number.isInteger(year) && year >= 2022 && year <= currentYear ? year : currentYear;
}

function num(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function summarize(row) {
  const data = row.data || {};
  const usa = data.official?.usa || null;
  const europe = data.official?.europe || null;
  const event = data.official?.currentEvents?.[0] || null;

  return {
    id: row.id,
    year: row.year,
    generatedAt: row.generated_at,
    createdAt: row.created_at,
    mapPoints: Array.isArray(data.mapPoints) ? data.mapPoints.length : 0,
    signalsTotal: num(data.signals?.total) || 0,
    signalCountries: num(data.signals?.countriesWithSignals) || 0,
    usaYtd: usa ? num(usa.totalYtd) : null,
    usaLatestWeek: usa ? num(usa.latestWeek) : null,
    usaLatestWeekCases: usa ? num(usa.latestWeekCases) : null,
    europeCases: europe ? num(europe.totalCases) : null,
    currentEventCases: event ? num(event.casesTotal) : null,
    status: data.status || {}
  };
}

function diff(a, b, key) {
  if (!a || !b) return null;
  if (a[key] === null || b[key] === null) return null;
  return Number(a[key]) - Number(b[key]);
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=900');

  if (!hasDatabaseUrl()) {
    return res.status(200).json({ year: parseYear(req), count: 0, summary: null, snapshots: [], database: false });
  }

  const sql = getSql();
  const year = parseYear(req);
  const limit = Math.min(Math.max(Number(req.query?.limit || 15), 2), 50);

  try {
    const rows = await sql`
      select id, year, generated_at, created_at, data
      from monitor_snapshots
      where year = ${year}
      order by generated_at desc
      limit ${limit}
    `;

    const snapshots = rows.map(summarize);
    const current = snapshots[0] || null;
    const previous = snapshots[1] || null;

    return res.status(200).json({
      year,
      count: snapshots.length,
      database: true,
      summary: current ? {
        current,
        previous,
        deltas: previous ? {
          signalsTotal: diff(current, previous, 'signalsTotal'),
          signalCountries: diff(current, previous, 'signalCountries'),
          usaYtd: diff(current, previous, 'usaYtd'),
          usaLatestWeek: diff(current, previous, 'usaLatestWeek'),
          usaLatestWeekCases: diff(current, previous, 'usaLatestWeekCases'),
          mapPoints: diff(current, previous, 'mapPoints'),
          currentEventCases: diff(current, previous, 'currentEventCases')
        } : null
      } : null,
      snapshots
    });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to read history', message: error.message });
  }
};

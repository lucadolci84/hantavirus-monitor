const { hasDatabaseUrl, getSql } = require('../lib/db');

function isoFromReq(req) {
  return String(req.query?.iso || '').trim().toUpperCase().slice(0, 2);
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=900');

  const iso = isoFromReq(req);
  if (!iso) return res.status(400).json({ error: 'Missing iso parameter' });

  if (!hasDatabaseUrl()) {
    return res.status(200).json({ iso, point: null, metrics: [], signals: [], database: false });
  }

  const sql = getSql();

  try {
    const latest = await sql`
      select data from monitor_snapshots
      order by generated_at desc
      limit 1
    `;
    const data = latest[0]?.data || null;
    const point = data?.mapPoints?.find(item => String(item.iso).toUpperCase() === iso) || null;

    const [metrics, signals] = await Promise.all([
      sql`
        select metric_type, metric_year, metric_week, value, rate, source_id, source_url, observed_at
        from country_metrics
        where country_iso2 = ${iso}
        order by metric_year desc nulls last, metric_week desc nulls last, observed_at desc
        limit 80
      `,
      sql`
        select title, url, source, country_iso2, country_name, kind, published_at, inserted_at
        from signals
        where country_iso2 = ${iso}
        order by published_at desc nulls last, inserted_at desc
        limit 30
      `
    ]);

    return res.status(200).json({ iso, point, metrics, signals, database: true });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to read country data', message: error.message });
  }
};

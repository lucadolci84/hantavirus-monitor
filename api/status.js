const { hasDatabaseUrl, getSql, checkDatabase } = require('../lib/db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=900');

  if (!hasDatabaseUrl()) {
    return res.status(200).json({
      database: { configured: false, connected: false },
      latestSnapshot: null,
      counts: {},
      fetchLogs: [],
      sources: []
    });
  }

  const connected = await checkDatabase();
  if (!connected) {
    return res.status(200).json({
      database: { configured: true, connected: false },
      latestSnapshot: null,
      counts: {},
      fetchLogs: [],
      sources: []
    });
  }

  const sql = getSql();

  try {
    const [latest, snapshots, signals, sourcesCount, metrics, events, logs, sources] = await Promise.all([
      sql`select id, year, generated_at, created_at from monitor_snapshots order by generated_at desc limit 1`,
      sql`select count(*)::int as count from monitor_snapshots`,
      sql`select count(*)::int as count from signals`,
      sql`select count(*)::int as count from sources`,
      sql`select count(*)::int as count from country_metrics`,
      sql`select count(*)::int as count from events`,
      sql`select source_id, status, message, fetched_at from fetch_logs order by fetched_at desc limit 10`,
      sql`select id, name, type, coverage, reliability, url, updated_at from sources order by id`
    ]);

    return res.status(200).json({
      database: { configured: true, connected: true },
      latestSnapshot: latest[0] || null,
      counts: {
        snapshots: snapshots[0]?.count || 0,
        signals: signals[0]?.count || 0,
        sources: sourcesCount[0]?.count || 0,
        metrics: metrics[0]?.count || 0,
        events: events[0]?.count || 0
      },
      fetchLogs: logs,
      sources
    });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to read status', message: error.message });
  }
};

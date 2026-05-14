const { hasDatabaseUrl } = require('../lib/db');
const { collectMonitorData } = require('../lib/sources');
const { getLatestSnapshot, insertFetchLog } = require('../lib/store');

function parseYear(req) {
  const currentYear = new Date().getFullYear();
  const year = Number(req.query?.year || currentYear);

  if (Number.isInteger(year) && year >= 2022 && year <= currentYear) {
    return year;
  }

  return currentYear;
}

module.exports = async function handler(req, res) {
  const year = parseYear(req);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');

  try {
    if (hasDatabaseUrl() && req.query?.live !== '1') {
      const snapshot = await getLatestSnapshot(year);

      if (snapshot) {
        return res.status(200).json({
          ...snapshot,
          meta: {
            ...(snapshot.meta || {}),
            fromDatabase: true,
            databaseYear: year
          }
        });
      }
    }
  } catch (error) {
    try {
      await insertFetchLog('monitor', 'warning', `DB read failed: ${error.message}`);
    } catch (_) {}
  }

  try {
    const data = await collectMonitorData({ year });

    return res.status(200).json({
      ...data,
      meta: {
        fromDatabase: false,
        reason: hasDatabaseUrl()
          ? 'No database snapshot found; served live fallback.'
          : 'DATABASE_URL not configured; served live fallback.'
      }
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Unable to build monitor data',
      message: error.message
    });
  }
};

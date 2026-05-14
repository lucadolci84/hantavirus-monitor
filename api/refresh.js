const { hasDatabaseUrl } = require('../lib/db');
const { collectMonitorData } = require('../lib/sources');
const { persistMonitorData, insertFetchLog } = require('../lib/store');

function requestUrl(req) {
  const proto = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host || 'localhost';
  return new URL(req.url || '/api/refresh', `${proto}://${host}`);
}

function parseYear(req) {
  const currentYear = new Date().getFullYear();
  const url = requestUrl(req);
  const year = Number(url.searchParams.get('year') || currentYear);

  if (Number.isInteger(year) && year >= 2022 && year <= currentYear) {
    return year;
  }

  return currentYear;
}

function isLocalRequest(req) {
  const host = String(req.headers.host || '').toLowerCase();
  return host.includes('localhost') || host.includes('127.0.0.1');
}

function isAuthorized(req) {
  if (isLocalRequest(req)) return true;

  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const url = requestUrl(req);
  const querySecret = url.searchParams.get('secret');
  const authHeader = req.headers.authorization || '';

  return authHeader === `Bearer ${secret}` || querySecret === secret;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  if (!hasDatabaseUrl()) {
    return res.status(500).json({
      error: 'DATABASE_URL is not configured',
      nextStep: 'Create a Neon database and add DATABASE_URL to your local .env and Vercel Environment Variables.'
    });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({
      error: 'Unauthorized',
      nextStep: 'Set CRON_SECRET in Vercel and call this endpoint with Authorization: Bearer <CRON_SECRET>, or use Vercel Cron.'
    });
  }

  const year = parseYear(req);

  try {
    const data = await collectMonitorData({ year });
    const result = await persistMonitorData(data, year);

    return res.status(200).json({
      ok: true,
      year,
      snapshotId: result.snapshotId,
      generatedAt: data.generatedAt,
      status: data.status
    });
  } catch (error) {
    try {
      await insertFetchLog('refresh', 'error', error.message);
    } catch (_) {}

    return res.status(500).json({
      error: 'Refresh failed',
      message: error.message
    });
  }
};

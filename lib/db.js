const { neon } = require('@neondatabase/serverless');

let sqlClient = null;

function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

function getSql() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  if (!sqlClient) {
    sqlClient = neon(process.env.DATABASE_URL);
  }

  return sqlClient;
}

async function checkDatabase() {
  const sql = getSql();
  if (!sql) return false;

  try {
    await sql`select 1 as ok`;
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  getSql,
  hasDatabaseUrl,
  checkDatabase
};

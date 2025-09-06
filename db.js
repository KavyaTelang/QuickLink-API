const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // We will set this environment variable later
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
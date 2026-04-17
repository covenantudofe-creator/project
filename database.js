const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "database.db"));

// create table
db.exec(`
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE,
  gender TEXT,
  gender_probability REAL,
  sample_size INTEGER,
  age INTEGER,
  age_group TEXT,
  country_id TEXT,
  country_probability REAL,
  created_at TEXT
)
`);

console.log("Connected to SQLite database");

module.exports = db;
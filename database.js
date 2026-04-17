const sqlite3 = require("sqlite3").verbose();

// Create or connect to database file
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("DB Error:", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

// -------------------- CREATE TABLE --------------------
db.run(`
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

module.exports = db;
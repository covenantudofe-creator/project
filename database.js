const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "db.json");

// create file if it doesn't exist
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ profiles: [] }, null, 2));
}

function readDB() {
  return JSON.parse(fs.readFileSync(dbPath, "utf-8"));
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = {
  getAll: () => readDB().profiles,

  findByName: (name) =>
    readDB().profiles.find(p => p.name === name),

  findById: (id) =>
    readDB().profiles.find(p => p.id === id),

  insert: (profile) => {
    const db = readDB();
    db.profiles.push(profile);
    writeDB(db);
    return profile;
  },

  delete: (id) => {
    const db = readDB();
    const index = db.profiles.findIndex(p => p.id === id);

    if (index === -1) return false;

    db.profiles.splice(index, 1);
    writeDB(db);
    return true;
  }
};
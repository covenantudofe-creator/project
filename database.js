const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "db.json");

if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ profiles: [] }));
}

function read() {
  return JSON.parse(fs.readFileSync(dbPath));
}

function write(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = {
  getAll: () => read().profiles,
  findByName: (name) => read().profiles.find(p => p.name === name),
  insert: (profile) => {
    const db = read();
    db.profiles.push(profile);
    write(db);
  }
};
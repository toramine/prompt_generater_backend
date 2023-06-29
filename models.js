const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("mydb.db");

db.serialize(() => {
  db.run(`CREATE TABLE prompts (
    id INTEGER PRIMARY KEY,
    type TEXT NOT NULL,
    cluster TEXT NOT NULL,
    prompt TEXT UNIQUE,
    img TEXT,
    description TEXT,
    nsfw INTEGER
  )`);
});

db.close();

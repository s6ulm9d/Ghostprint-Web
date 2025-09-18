const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Database setup
const db = new sqlite3.Database("fingerprint.db", (err) => {
  if (err) console.error("DB Error: " + err.message);
  else console.log("✅ Connected to SQLite");
});

// Create table if not exists
db.run(`CREATE TABLE IF NOT EXISTS logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// API endpoint
app.post("/log", (req, res) => {
  const { event } = req.body;
  db.run("INSERT INTO logs(event) VALUES(?)", [event], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ success: false });
    } else {
      res.json({ success: true });
    }
  });
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

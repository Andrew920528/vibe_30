import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import path from "path";

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database(
  path.join(__dirname, "../database.sqlite"),
  (err) => {
    if (err) {
      console.error("Error connecting to the database:", err);
    } else {
      console.log("Connected to SQLite database");
      // Create tables when the database is first initialized
      initializeTables();
    }
  }
);

// Initialize database tables
function initializeTables() {
  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// Example route
app.get("/api/items", (req, res) => {
  db.all("SELECT * FROM items", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post("/api/items", (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ error: "Name is required" });
    return;
  }

  db.run("INSERT INTO items (name) VALUES (?)", [name], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, name });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

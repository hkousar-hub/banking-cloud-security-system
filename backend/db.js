import { DatabaseSync } from "node:sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "authDB.db");

const db = new DatabaseSync(dbPath);

db.exec("PRAGMA journal_mode = WAL;");

const connectDB = () => {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        last_ip TEXT,
        loginAttempts INTEGER DEFAULT 0,
        lockUntil INTEGER,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS attackLogs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT,
        ip TEXT,
        status TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS blockedIPs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip TEXT NOT NULL UNIQUE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_attackLogs_ip ON attackLogs(ip);
      CREATE INDEX IF NOT EXISTS idx_attackLogs_timestamp ON attackLogs(timestamp);
      CREATE INDEX IF NOT EXISTS idx_blockedIPs_ip ON blockedIPs(ip);
    `);
    console.log("✅ SQLite Database Connected");
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    process.exit(1);
  }
};

export { db };
export default connectDB;
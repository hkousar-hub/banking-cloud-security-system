import { db } from "../db.js";

class AttackLog {
  static find(query) {
    let sql = "SELECT * FROM attackLogs WHERE 1=1";
    const values = [];
    if (query.ip) {
      sql += " AND ip = ?";
      values.push(query.ip);
    }
    if (query.status) {
      sql += " AND status = ?";
      values.push(query.status);
    }
    if (query.timestamp && query.timestamp.$gte) {
      sql += " AND timestamp >= ?";
      values.push(new Date(query.timestamp.$gte).toISOString());
    }
    const stmt = db.prepare(sql);
    return values.length ? stmt.all(...values) : stmt.all();
  }

  static create(data) {
    const stmt = db.prepare(
      "INSERT INTO attackLogs (email, ip, status, timestamp) VALUES (?, ?, ?, CURRENT_TIMESTAMP)"
    );
    const result = stmt.run(data.email, data.ip, data.status);
    return { id: result.lastInsertRowid, ...data };
  }
}

export default AttackLog;
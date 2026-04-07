import { db } from "../db.js";

class BlockedIP {
  static findOne(query) {
    const { ip } = query;
    const stmt = db.prepare("SELECT * FROM blockedIPs WHERE ip = ?");
    return stmt.get(ip);
  }

  static create(data) {
    const stmt = db.prepare(
      "INSERT INTO blockedIPs (ip) VALUES (?)"
    );
    const result = stmt.run(data.ip);
    return { id: result.lastInsertRowid, ...data };
  }

  static find(query) {
    const sql = "SELECT * FROM blockedIPs";
    const stmt = db.prepare(sql);
    return stmt.all();
  }
}

export default BlockedIP;
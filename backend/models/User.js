import { db } from "../db.js";

class User {
  static findOne(query) {
    const { email } = query;
    const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
    return stmt.get(email);
  }

  static find(query) {
    let sql = "SELECT * FROM users";
    const values = [];
    if (query.email) {
      sql += " WHERE email = ?";
      values.push(query.email);
    }
    const stmt = db.prepare(sql);
    return values.length ? stmt.all(...values) : stmt.all();
  }

  static create(data) {
    const stmt = db.prepare(
      "INSERT INTO users (email, password, last_ip, loginAttempts, lockUntil) VALUES (?, ?, ?, ?, ?)"
    );
    const result = stmt.run(
      data.email,
      data.password,
      data.last_ip || null,
      data.loginAttempts || 0,
      data.lockUntil || null
    );
    return { id: result.lastInsertRowid, ...data };
  }

  static updateOne(query, update) {
    const { email } = query;
    const updates = [];
    const values = [];
    for (const [key, value] of Object.entries(update)) {
      updates.push(`${key} = ?`);
      values.push(value);
    }
    values.push(email);
    const sql = `UPDATE users SET ${updates.join(", ")} WHERE email = ?`;
    const stmt = db.prepare(sql);
    return stmt.run(...values);
  }

  constructor(data) {
    this.email = data.email;
    this.password = data.password;
    this.last_ip = data.last_ip;
    this.loginAttempts = data.loginAttempts || 0;
    this.lockUntil = data.lockUntil;
  }

  save() {
    const stmt = db.prepare(
      "INSERT INTO users (email, password, last_ip, loginAttempts, lockUntil) VALUES (?, ?, ?, ?, ?)"
    );
    const result = stmt.run(
      this.email,
      this.password,
      this.last_ip,
      this.loginAttempts,
      this.lockUntil
    );
    this.id = result.lastInsertRowid;
    return this;
  }
}

export default User;
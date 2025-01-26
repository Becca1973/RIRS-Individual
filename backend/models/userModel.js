const db = require("../db");

const User = {
  create: (userData, callback) => {
    const query = `INSERT INTO uporabnik (ime, priimek, email, geslo, tip_uporabnika_id) VALUES ($1, $2, $3, $4, $5)`;
    db.query(
      query,
      [userData.ime, userData.priimek, userData.email, userData.geslo, 1],
      callback
    );
  },

  getAll: (callback) => {
    const query = `SELECT id, ime, priimek, email, tip_uporabnika_id FROM uporabnik`;
    db.query(query, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return callback(err, null);
      }
      callback(null, results.rows); // Spremenjeno za PostgreSQL
    });
  },

  findByEmail: (email, callback) => {
    const query = `SELECT * FROM uporabnik WHERE email = $1`;
    db.query(query, [email], (err, results) => {
      if (err) {
        console.error("Error during email check:", err);
        return callback(err, null);
      }
      callback(null, results.rows); // Spremenjeno za PostgreSQL
    });
  },

  findById: (id, callback) => {
    const query = `SELECT id, ime, priimek, email, tip_uporabnika_id FROM uporabnik WHERE id = $1`;
    db.query(query, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results.rows[0]); // Spremenjeno za PostgreSQL
    });
  },

  update: (id, tip_uporabnika_id, callback) => {
    const query = `UPDATE uporabnik SET tip_uporabnika_id = $1 WHERE id = $2`;
    db.query(query, [tip_uporabnika_id, id], callback);
  },
};

module.exports = User;

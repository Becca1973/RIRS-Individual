const db = require("../db");

const User = {
  create: (userData, callback) => {
    const query = `INSERT INTO uporabnik (ime, priimek, email, geslo, tip_uporabnika_id) VALUES (?, ?, ?, ?, ?)`;
    db.query(
      query,
      [userData.ime, userData.priimek, userData.email, userData.geslo, 1],
      callback
    );
  },

  findByEmail: (email, callback) => {
    const query = `SELECT * FROM uporabnik WHERE email = ?`;
    db.query(query, [email], (err, results) => {
      if (err) {
        console.error("Error during email check:", err);
        return callback(err, null);
      }
      if (results && results.length > 0) {
        return callback(null, results); // vrni vse rezultate, ki so našli
      }
      callback(null, []); // če ni rezultatov, vrni prazen seznam
    });
  },
  getAll: (callback) => {
    const query = `SELECT id, ime, priimek, email, tip_uporabnika_id FROM uporabnik`;
    db.query(query, callback);
  },

  findById: (id, callback) => {
    const query = `SELECT id, ime, priimek, email, tip_uporabnika_id FROM uporabnik WHERE id = ?`;
    db.query(query, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  update: (id, tip_uporabnika_id, callback) => {
    const query = `UPDATE uporabnik SET tip_uporabnika_id = ? WHERE id = ?`;
    db.query(query, [tip_uporabnika_id, id], callback);
  },
};

module.exports = User;

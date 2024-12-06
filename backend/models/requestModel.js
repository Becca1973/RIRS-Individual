const db = require("../db");

const Request = {
  getAllGrouped: (callback) => {
    const query = `SELECT     
    u.email,
    z.id,
    z.datum_zahteve,
    z.stanje,
    z.komentar,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'zacetek', d.zacetek,
            'konec', d.konec,
            'razlog', d.razlog,
            'tip_dopusta', td.tip
        )
    ) AS dopusti
FROM 
    zahteva z
JOIN 
    uporabnik u ON u.id = z.uporabnik_id
JOIN 
    dopust d ON d.zahteva_id = z.id
JOIN 
    tip_dopusta td ON d.tip_dopusta_id = td.id
GROUP BY 
    z.id, u.email, z.datum_zahteve, z.stanje, z.komentar;`;
    db.query(query, callback);
  },

  getAllLeaves: (callback) => {
    const query = `
      SELECT 
        u.ime,
        u.priimek,
        td.tip AS tip_dopusta,
        d.zacetek,
        d.konec
      FROM 
        dopust d
      JOIN 
        zahteva z ON d.zahteva_id = z.id
      JOIN 
        uporabnik u ON u.id = z.uporabnik_id
      JOIN 
        tip_dopusta td ON d.tip_dopusta_id = td.id;
    `;
    db.query(query, callback);
  },

  update: (id, stanje, callback) => {
    const query = `UPDATE zahteva SET stanje = ? WHERE id = ?`;
    db.query(query, [stanje, id], callback);
  },

  create: (requestData, callback) => {
    const query = `INSERT INTO zahteva (komentar, uporabnik_id, datum_zahteve, stanje) VALUES (?, ?, ?, ?)`;
    db.query(
      query,
      [
        requestData.komentar,
        requestData.uporabnik_id,
        requestData.datum_zahteve,
        requestData.stanje,
      ],
      callback
    );
  },

  createLeave: (leaveData, callback) => {
    const query = `INSERT INTO dopust (zacetek, konec, razlog, tip_dopusta_id, zahteva_id) VALUES (?, ?, ?, ?, ?)`;
    db.query(
      query,
      [
        leaveData.zacetek,
        leaveData.konec,
        leaveData.razlog,
        leaveData.tip_dopusta_id,
        leaveData.zahteva_id,
      ],
      callback
    );
  },
  getRequestsByUserId: (userId, callback) => {
    const query = `
      SELECT 
        z.id,
        z.datum_zahteve,
        z.stanje,
        z.komentar,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', d.id,
                'zacetek', d.zacetek,
                'konec', d.konec,
                'razlog', d.razlog,
                'tip_dopusta', td.tip
            )
        ) AS dopusti
      FROM 
        zahteva z
      JOIN 
        dopust d ON d.zahteva_id = z.id
      JOIN 
        tip_dopusta td ON d.tip_dopusta_id = td.id
      WHERE 
        z.uporabnik_id = ?
      GROUP BY 
        z.id, z.datum_zahteve, z.stanje, z.komentar;
    `;
    db.query(query, [userId], callback);
  },

  getLeaveStatsByUser: (callback) => {
    const query = `
      SELECT 
        u.ime, 
        u.priimek,
        SUM(DATEDIFF(d.konec, d.zacetek) + 1) AS odobreniDopusti, 
        LEAST(SUM(DATEDIFF(d.konec, d.zacetek) + 1), 30) AS skupniDopusti
      FROM 
        zahteva z
      JOIN 
        uporabnik u ON u.id = z.uporabnik_id
      JOIN 
        dopust d ON d.zahteva_id = z.id  -- Priključite tabelo dopust
      WHERE 
        z.stanje = 'Accepted'
      GROUP BY 
        u.id;
    `;
    db.query(query, callback);
  },
  deleteLeave: (leaveId, callback) => {
    const query = `DELETE FROM dopust WHERE id = ?`;
    db.query(query, [leaveId], (err, result) => {
      if (err) {
        console.error("Error in SQL query:", err);
        return callback(err, null);
      }
      callback(null, result);
    });
  },
};

module.exports = Request;

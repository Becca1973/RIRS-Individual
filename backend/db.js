const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.PORT,
  ssl: {
    rejectUnauthorized: false, // Sprejmi nezaupne certifikate
    sslmode: "require", // Dodaj sslmode za zahtevano šifriranje
  },
});

db.connect()
  .then(() => {
    console.log("Connected to PostgreSQL database");
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });

module.exports = db;

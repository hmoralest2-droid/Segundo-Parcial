import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pg;

// Conexión a PostgreSQL con variables de entorno
const pool = new Pool({
  connectionString: process.env.URL_POSTGRES,
  ssl: { rejectUnauthorized: false }
});


export default pool; 
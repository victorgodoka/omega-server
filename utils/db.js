import mysql from 'mysql2/promise';
import { config } from 'dotenv';
config();

// Cria a pool de conexões
const pool = mysql.createPool({
  host: 'game.duelistsunite.org',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;

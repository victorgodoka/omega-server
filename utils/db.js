import mysql from 'mysql2/promise';
import { config } from 'dotenv';
import mongoose from 'mongoose';
config();

// Cria a pool de conexões
const pool = mysql.createPool({
  host: 'game.duelistsunite.org',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  database: 'omega'
});

export default pool;

const dbUser = process.env.MONGO_INITDB_ROOT_USERNAME;
const dbPassword = process.env.MONGO_INITDB_ROOT_PASSWORD;
const dbName = process.env.MONGO_DB_NAME;

const MONGO_URI = `mongodb://${dbUser}:${dbPassword}@127.0.0.1:27017/${dbName}?authSource=admin`;
console.log(MONGO_URI)
export const connectMongo = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Conectado ao MongoDB');
  } catch (err) {
    console.error('❌ Erro ao conectar ao MongoDB:', err);
    process.exit(1);
  }
};

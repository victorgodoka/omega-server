import mysql from 'mysql2/promise';
import { config } from 'dotenv';
import { GraphQLClient } from 'graphql-request';
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

const hasuraUrl = 'http://localhost:8080/v1/graphql';

export const graphQLClient = new GraphQLClient(hasuraUrl, {
  headers: {
    'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET, // Substitua com a chave secreta do Hasura
  },
});

export default pool;

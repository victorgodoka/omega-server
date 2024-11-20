const mysql = require('mysql2');

// Crie uma conexão de pool para melhor performance e gerenciamento de conexões
const pool = mysql.createPool({
  host: 'game.duelistsunite.org',      // Endereço do servidor
  user: 'omega',           // Usuário do MySQL
  password: 'reader',  // Senha do MySQL
  database: 'omega', // Nome do banco de dados
  waitForConnections: true,
  connectionLimit: 10,       // Número máximo de conexões no pool
  queueLimit: 0
});

const promisePool = pool.promise();

module.exports = promisePool;
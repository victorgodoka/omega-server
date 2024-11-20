// routes/users.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // Importa a conexão com o banco de dados

// Rota GET para buscar todos os usuários
router.get('/', async (req, res) => {
  try {
    const [rows, fields] = await db.query("SELECT  `duelist1`, `duelist2`, `deck1`, `deck2`, `start` FROM `duel` WHERE `start` >= '2024-09-02 00:00:00' GROUP BY `duelist1`, `duelist2`, `deck1`, `deck2`, `start`;");
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ mensagem: 'Erro no servidor.' });
  }
});

module.exports = router;

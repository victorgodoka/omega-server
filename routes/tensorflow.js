const express = require('express');
const router = express.Router();
const db = require('../db');
const { determineMatchWinner, contarRepeticoes } = require('../utils/decks')
const { decode } = require('../utils/converter');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT deck1, deck2, result, result1, result2, result3 FROM duel WHERE region = 1 LIMIT 10
    `)
    
    const data = rows.map(({ result1, result2, result3, deck1, deck2 }) => {
      const result = determineMatchWinner([result1, result2, result3])
      const decks = [decode(deck1).passwords, decode(deck2).passwords];

      return {
        winner: contarRepeticoes(result === 0 ? decks[0] : decks[1]),
        loser: contarRepeticoes(result === 1 ? decks[0] : decks[1]),
        result
      }
    })
    res.json(data)
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    res.status(500).json({ mensagem: 'Erro no servidor.' });
  }
});

module.exports = router;

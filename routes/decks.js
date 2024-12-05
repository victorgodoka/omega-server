import express from 'express'
import { convertTodeck, contarDecks } from '../utils/decks.js'
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const db = await mysql.createPool({
  host: 'game.duelistsunite.org',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'omega',
});

router.get('/', async (req, res) => {
  const { id } = req.query;
  try {
    const [rows] = await db.query(
      `SELECT CAST(d.duelist1 AS CHAR) AS duelist1, CAST(d.duelist2 AS CHAR) AS duelist2, d.deck1, d.deck2, d.start, d.result, d.result1,d.result2,d.result3,
        u1.username AS duelist1_username,
        u1.avatar AS duelist1_avatar,
        u1.displayname AS duelist1_displayname,
        u2.username AS duelist2_username,
        u2.avatar AS duelist2_avatar,
        u2.displayname AS duelist2_displayname
       FROM duel d
      JOIN
          user_discord_data u1 ON u1.discord_id = d.duelist1
      JOIN
          user_discord_data u2 ON u2.discord_id = d.duelist2
       WHERE (duelist1 = ? OR duelist2 = ?) AND region = 1
       GROUP BY duelist1, duelist2, deck1, deck2, start
       ORDER BY start DESC`,
      [id, id]
    );

    const result = rows.slice(0, 10).map(async row => {
      const duelist = {
        id,
        deck: row.duelist1 === id ? await convertTodeck(row.deck1) : await convertTodeck(row.deck2),
        discord: {
          username: row.duelist1 === id ? row.duelist1_username : row.duelist2_username,
          avatar: row.duelist1 === id ? row.duelist1_avatar : row.duelist2_avatar,
          displayname: row.duelist1 === id ? row.duelist1_displayname : row.duelist2_displayname
        }
      };

      const opponent = {
        id: row.duelist1 === id ? row.duelist2 : row.duelist1,
        deck: row.duelist1 === id ? await convertTodeck(row.deck2) : await convertTodeck(row.deck1),
        discord: {
          username: row.duelist1 === id ? row.duelist2_username : row.duelist1_username,
          avatar: row.duelist1 === id ? row.duelist2_avatar : row.duelist1_avatar,
          displayname: row.duelist1 === id ? row.duelist2_displayname : row.duelist1_displayname
        }
      };

      // const result = mostFrequentValue([row.result1, row.result2, row.result3].filter(n => n >= 0))
      const result = row.result
      const winner = (result === 0 ? row.duelist1 : result === 1 ? row.duelist2 : false)
      const isWinner = winner === id
      const isDraw = result === 2

      return { duelist, opponent, result, winner, isWinner, isDraw, start: row.start };
    });

    const mostUsedDecks = rows.map(async row => {
      const deck = row.duelist1 === id ? await convertTodeck(row.deck1) : await convertTodeck(row.deck2)
      return deck
    })

    const decks = contarDecks(await Promise.all(mostUsedDecks)).sort((a, b) => b.qtd - a.qtd)
    const mostUsedArchetypes = {
      decks,
      total: decks.map(c => c.qtd).reduce((b, a) => b + a, 0) 
    }

    res.json({ success: true, data: { mostUsedArchetypes, matchHistory: await Promise.all(result) }});
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    res.status(500).json({ success: false, mensagem: 'Erro no servidor.' });
  }
});

export default router;

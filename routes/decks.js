import express from 'express'
import { decode } from '../utils/converter.js'
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

const LASTBANLIST = '2024-12-09'

router.get('/', async (req, res) => {
  const { id } = req.query;
  try {
    const [rows] = await db.query(
      `  SELECT DISTINCT
          CAST (d.duelist1 AS CHAR) as duelist1,
          CAST (d.duelist2 AS CHAR) as duelist2,
          (SELECT username FROM omega.user_discord_data u WHERE d.duelist1 = u.discord_id) AS duelist1_username,
          (SELECT avatar FROM omega.user_discord_data u WHERE d.duelist1 = u.discord_id) AS duelist1_avatar,
          (SELECT displayname FROM omega.user_discord_data u WHERE d.duelist1 = u.discord_id) AS duelist1_displayname,
          (SELECT username FROM omega.user_discord_data u WHERE d.duelist2 = u.discord_id) AS duelist2_username,
          (SELECT avatar FROM omega.user_discord_data u WHERE d.duelist2 = u.discord_id) AS duelist2_avatar,
          (SELECT displayname FROM omega.user_discord_data u WHERE d.duelist2 = u.discord_id) AS duelist2_displayname,
          d.deck1,
          d.deck2,
          d.start,
          d.end
        FROM omega.duel d
        WHERE (d.duelist1 IN (${id}) OR d.duelist2 IN (${id})) AND d.start > '${LASTBANLIST}'
        ORDER BY d.start DESC;`,
      [id, id]
    );

    const result = rows.slice(0, 10).map(async row => {
      const duelist = {
        id: row.duelist1 === id ? row.duelist1 : row.duelist2,
        deck: row.duelist1 === id ? await convertTodeck(decode(row.deck1).passwords) : await convertTodeck(decode(row.deck2).passwords),
        discord: {
          username: row.duelist1 === id ? row.duelist1_username : row.duelist2_username,
          avatar: row.duelist1 === id ? row.duelist1_avatar : row.duelist2_avatar,
          displayname: row.duelist1 === id ? row.duelist1_displayname : row.duelist2_displayname
        }
      };

      const opponent = {
        id: row.duelist1 === id ? row.duelist2 : row.duelist1,
        deck: row.duelist1 === id ? await convertTodeck(decode(row.deck2).passwords) : await convertTodeck(decode(row.deck1).passwords),
        discord: {
          username: row.duelist1 === id ? row.duelist2_username : row.duelist1_username,
          avatar: row.duelist1 === id ? row.duelist2_avatar : row.duelist1_avatar,
          displayname: row.duelist1 === id ? row.duelist2_displayname : row.duelist1_displayname
        }
      };

      // const result = mostFrequentValue([row.result1, row.result2, row.result3].filter(n => n >= 0))
      const winner = row.duelist1
      const isWinner = row.duelist1 === id
      const isDraw = false

      return { duelist, opponent, winner, isWinner, isDraw, start: row.start, end: row.end };
    });

    const mostUsedDecks = rows.map(async row => {
      const deck = row.duelist1 === id ? (await convertTodeck(decode(row.deck1).passwords)).mostUsed : (await convertTodeck(decode(row.deck2).passwords)).mostUsed
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

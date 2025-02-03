import express from 'express'
import mysql from 'mysql2/promise';
import moment from "moment";
import dotenv from 'dotenv';
import db from '../utils/db.js';
import { LASTBANLIST } from '../index.js';
import { getDeck } from '../utils/decks.js';
dotenv.config();

const router = express.Router();
const getFinalData = (arr) => arr.reduce((acc, { deck, win, loss }) => {
  // console.log(arr)
  // Encontra o objeto correspondente ao deck
  const existingDeck = acc.find(item => item.deck === deck);

  if (existingDeck) {
    // Atualiza os valores de wins e losses
    if (win) existingDeck.wins++;
    if (loss) existingDeck.loss++;
    existingDeck.total++;
  } else {
    // Se não existir, cria um novo objeto para o deck
    acc.push({
      deck,
      wins: win ? 1 : 0,
      loss: loss ? 1 : 0,
      total: 1,
    });
  }

  return acc;
}, []).sort((b, a) => a.total - b.total);

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
        WHERE (d.duelist1 IN (${id}) OR d.duelist2 IN (${id})) AND d.start >= '${LASTBANLIST}' AND d.region = 1
        ORDER BY d.start DESC;`,
      [id, id]
    );

    const getCardIds = (arr) => {
      return arr.map(c => c.ids).flat().sort(() => Math.random() - 0.5).slice(0, 3)
    }

    const result = rows.map(async row => {
      const sideA = await getDeck(row.deck1)
      const sideB = await getDeck(row.deck2)

      console.log(sideA)
      console.log(sideB)
      const duelist = {
        id: row.duelist1 === id ? row.duelist1 : row.duelist2,
        deck: row.duelist1 === id ? sideA : sideB,
        ids: row.duelist1 === id ? getCardIds(sideA) : getCardIds(sideB),
        discord: {
          username: row.duelist1 === id ? row.duelist1_username : row.duelist2_username,
          avatar: row.duelist1 === id ? row.duelist1_avatar : row.duelist2_avatar,
          displayname: row.duelist1 === id ? row.duelist1_displayname : row.duelist2_displayname
        }
      };

      const opponent = {
        id: row.duelist1 === id ? row.duelist2 : row.duelist1,
        deck: row.duelist1 === id ? sideB : sideA,
        ids: row.duelist1 === id ? getCardIds(sideB) : getCardIds(sideA),
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

    const matchHistory = await Promise.all(result)
    const eventos = matchHistory.map(({ start, end }) => ({ inicio: start, fim: end }))

    // Inicializa a duração total
    let duracaoTotal = moment.duration(0);

    eventos.forEach(evento => {
      const inicio = moment(evento.inicio);
      const fim = moment(evento.fim);
      duracaoTotal += fim.diff(inicio, "ms");
    });

    const onlyOpponentDecks = matchHistory.map(({ opponent, isWinner }) => ({ deck: opponent.deck[0]?.archetype, win: isWinner, loss: !isWinner }))
    const onlyDuelistDecks = matchHistory.map(({ duelist, isWinner }) => ({ deck: duelist.deck[0]?.archetype, win: isWinner, loss: !isWinner }))
    const opponentDecks = getFinalData(onlyOpponentDecks)
    const mostUsedArchetypes = getFinalData(onlyDuelistDecks)

    res.json({ success: true, data: { opponentDecks, totalGaming: moment.utc(duracaoTotal).format("HH[h] mm[m]"), mostUsedArchetypes, matchHistory,  }});
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    res.status(500).json({ success: false, mensagem: 'Erro no servidor.' });
  }
});

export default router;

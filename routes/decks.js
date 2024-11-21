const express = require('express');
const router = express.Router();
const db = require('../db');
const { decode } = require('../utils/converter');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const axios = require('axios');
const carddb = require('./carddb.json');

const getRowsByIds = (ids) => {
  const dbPath = path.join(__dirname, 'OmegaDB.cdb');
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        reject('Erro ao conectar ao banco de dados: ' + err.message);
      }
    });

    const placeholders = ids.map(() => '?').join(',');
    const sql = `SELECT x.id, x.name FROM texts x WHERE id IN (${placeholders})`;

    db.all(sql, ids, (err, rows) => {
      if (err) {
        reject('Erro ao executar a consulta: ' + err.message);
      } else {
        resolve(rows);
      }
    });


    db.close();
  });
};

function contarRepeticoes(arr) {
  const contador = {};
  arr.forEach(num => {
    contador[num] = (contador[num] || 0) + 1;
  });

  const resultado = Object.keys(contador).map(key => ({
    id: parseInt(key),
    qtd: contador[key]
  }));

  return resultado;
}

const contarDecks = array => Object.keys(array.reduce((acc, { archetype }) => {
  acc[archetype] = acc[archetype] ? acc[archetype] + 1 : 1;
  return acc;
}, {})).map(archetype => ({
  archetype,
  qtd: array.filter(item => item.archetype === archetype).length
}));

function unirArrays(...arrays) {
  return arrays[0].map(item1 => {
    const mergedItem = { ...item1 };
    for (let i = 1; i < arrays.length; i++) {
      const array = arrays[i];
      const item2 = array.find(item => item.id === item1.id);

      if (item2) {
        Object.assign(mergedItem, item2);
      }
    }

    return mergedItem;
  });
}

const getData = (ids) => {
  return carddb.filter(c => ids.includes(c.id))
}

const groupedArchetypes = (arr) => Object.values(
  arr.reduce((acc, card) => {
    const { archetype, qtd, cardIds } = card;
    if (!acc[archetype]) {
      acc[archetype] = { archetype, qtd: 0, cardIds };
    }
    acc[archetype].qtd += qtd;
    return acc;
  }, {})
);

function mostFrequentValue(arr) {
  const count = {};

  for (const num of arr) {
    count[num] = (count[num] || 0) + 1;
  }

  let mostFrequent = null;
  let maxCount = 0;

  for (const [num, freq] of Object.entries(count)) {
    if (freq > maxCount) {
      mostFrequent = Number(num);
      maxCount = freq;
    }
  }

  return mostFrequent;
}

const convertTodeck = async (omegaCode) => {
  const { passwords } = decode(omegaCode);
  const deck = contarRepeticoes(passwords)
  const deckNames = await getRowsByIds(deck.map(c => c.id))
  const cardsInfo = getData(deckNames.map(c => c.id)).map(({ archetype, id }) => ({ archetype, id }))
  const mostUsed = groupedArchetypes(unirArrays(deck, deckNames, cardsInfo).filter(c => c.archetype)).sort((a, b) => b.qtd - a.qtd)[0]
  return {
    ...mostUsed,
    cardIds: cardsInfo.filter(c => c.archetype === mostUsed.archetype).slice(0, 3).map(c => c.id)
  }
}

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

    res.json({ mostUsedArchetypes, matchHistory: await Promise.all(result) });
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    res.status(500).json({ mensagem: 'Erro no servidor.' });
  }
});

module.exports = router;

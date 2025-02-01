import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import path from 'path'
import carddb from './carddb.js'
import db from './db.js';
import { decode } from './converter.js'
import { archetypeLib, decodeDeck } from './setcodes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getData = (ids) => {
  return carddb.filter(c => ids.includes(c.id))
}

export const determineMatchWinner = (results) => {
  let player1Wins = 0;
  let player2Wins = 0;

  results.forEach(result => {
    if (result === 0) player1Wins++;
    else if (result === 1) player2Wins++;
  });

  if (player1Wins >= 2) return 0;
  if (player2Wins >= 2) return 1;

  return -1; // Sem vencedor (empate ou incompleto)
};

export function contarRepeticoes(arr, str) {
  const contador = {};
  arr.forEach(num => {
    contador[num] = (contador[num] || 0) + 1;
  });

  const resultado = Object.keys(contador).map(key => ({
    id: str ? key : parseInt(key),
    qtd: contador[key]
  }));

  return resultado;
}

export const getRowsByIds = (ids) => {
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
    })

    db.close((closeErr) => {
      if (closeErr) {
        console.error(`Erro ao fechar o banco de dados: ${closeErr.message}`);
      }
    });
  });
};

export const contarDecks = array => Object.keys(array.reduce((acc, { archetype }) => {
  acc[archetype] = acc[archetype] ? acc[archetype] + 1 : 1;
  return acc;
}, {})).map(archetype => ({
  archetype,
  qtd: array.filter(item => item.archetype === archetype).length
}));

export function unirArrays(...arrays) {
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

export const groupedArchetypes = (arr) => Object.values(
  arr.reduce((acc, card) => {
    const { archetype, qtd, cardIds } = card;
    if (!acc[archetype]) {
      acc[archetype] = { archetype, qtd: 0, cardIds };
    }
    acc[archetype].qtd += qtd;
    return acc;
  }, {})
);

export const convertTodeck = async (passwords, all) => {
  const deck = contarRepeticoes(passwords)
  const deckNames = await getRowsByIds(deck.map(c => c.id))
  const cardsInfo = getData(deckNames.map(c => c.id)).map(({ archetype, id }) => ({ archetype, id }))
  const mostUsedAll = groupedArchetypes(unirArrays(deck, deckNames, cardsInfo).filter(c => c.archetype)).sort((a, b) => b.qtd - a.qtd)
  const mostUsed = all ? mostUsedAll : mostUsedAll[0]

  return {
    mostUsed,
    cardIds: cardsInfo.filter(c => c.archetype === mostUsed.archetype).slice(0, 3).map(c => c.id)
  }
}

export const getAvatarUrl = (id, avatar) => {
  if (!avatar) return ""
  if (avatar.startsWith('http')) return avatar
  
  const type = avatar.startsWith('a_') ? 'gif' : 'png'
  return `https://cdn.discordapp.com/avatars/${id}/${avatar}.${type}`
}

export const getTopDecks = async (pageSize, offset) => {
  const query = `
WITH deck_users AS (
  SELECT
    deck1 AS deck,
    duelist1 AS user
  FROM omega.duel
  WHERE start > '2024-12-09'
  UNION ALL
  SELECT
    deck2 AS deck,
    duelist2 AS user
  FROM omega.duel
  WHERE start > '2024-12-09'
),
deck_stats AS (
  SELECT
    deck_name,
    SUM(CASE WHEN result = 0 THEN 1 ELSE 0 END) AS wins,
    SUM(CASE WHEN result = 1 THEN 1 ELSE 0 END) AS losses,
    COUNT(DISTINCT user) AS users
  FROM (
    SELECT deck1 AS deck_name, duelist1 AS user, result
    FROM omega.duel
    WHERE start > '2024-12-09'
    UNION ALL
    SELECT deck2 AS deck_name, duelist2 AS user, 1 - result AS result
    FROM omega.duel
    WHERE start > '2024-12-09'
  ) AS all_decks
  GROUP BY deck_name
)
SELECT
  deck_name AS deck,
  wins,
  losses,
  users
FROM deck_stats
ORDER BY wins DESC, losses ASC, users DESC
LIMIT ? OFFSET ?;
`;

  const [rows] = await db.execute(query, [pageSize, offset]);
  return rows
}

export const getDeck = async (deck) => {
  const { mainSize, passwords } = decode(deck)
  const sets = await decodeDeck(passwords.slice(0, mainSize))
  const count = sets.reduce((acc, card) => {
    acc[card.set] = (acc[card.set] || 0) + 1;
    return acc;
  }, {})

  const archetypesPure = Object.entries(count)
    .sort((a, b) => b[1] - a[1])
    .map(([set, count]) => ({ ...archetypeLib.find(a => a.archetype.toLowerCase() === set.toLowerCase()), qtd: count, }))

  const archetypes = archetypesPure.filter(c => c.hasOwnProperty('archetype') & c.qtd >= ((archetypesPure[0].qtd / mainSize) / 2 * mainSize))
  if (archetypes.length > 0) {
    return archetypes
  } else {
    return archetypesPure.filter(c => c.hasOwnProperty('archetype'))
  }
}
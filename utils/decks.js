import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import path from 'path'
import carddb from './carddb.js'

sqlite3.verbose();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getData = (ids) => {
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
  console.log(array)
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
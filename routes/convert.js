import { decode } from '../utils/converter.js';
import express from 'express';
import sqlite3 from 'sqlite3';
sqlite3.verbose();

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { code } = req.query
    const deck = decode(code)

    const db = new sqlite3.Database("./omega.db", (err) => {
      if (err) {
        reject('Erro ao conectar ao banco de dados: ' + err.message);
      }
    });

    const sql = `SELECT x.id, x.alias FROM datas x WHERE id IN (${deck.passwords.join(',')})`;

    const data = await (new Promise((resolve, reject) => {
      db.all(sql, [], (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    }));

    res.status(200).json({
      success: true,
      message: 'Decks fetched successfully.',
      data: {...deck, passwords: deck.passwords.map(c => data.find(({ id }) => id === c)?.alias || c)}
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching decks.',
      data: error,
    });
  }
});

export default router;
import crypto from "crypto";
import express from 'express';
import Decks from '../models/decks.js'
import Users from '../models/users.js'
import { migrateDecks, getDeckStats, getDeckStatsByName, calculateScore } from '../utils/deckdata.js';
import { getDeck } from '../utils/decks.js';
import { decode } from '../utils/converter.js'
import { getDataOmega } from '../utils/setcodes.js'
import { connectMongo } from '../utils/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    await connectMongo();
    const results = await getDeckStats();
    const data = results.map(async ({ games, wins, _id, rating, uniqueUsersCount, winRate, lastDuel }) => ({
      id: crypto.createHash("sha256").update(_id).digest("hex").slice(0, 8),
      data: await getDeck(_id),
      score: calculateScore(wins, games, rating),
      games, wins, code: _id, rating, uniqueUsers: uniqueUsersCount, winRate, lastDuel
    }))

    res.json({ data: (await Promise.all(data)).sort((a, b) => b.score - a.score) });
  } catch (error) {
    console.error('❌ Erro ao buscar decks:', error);
    res.status(500).json({ message: 'Erro ao buscar os decks' });
  }
});

router.get('/deck', async (req, res) => {
  try {
    await connectMongo();
    const deck = req.query.deck;
    const results = (await getDeckStats(deck))[0]
    const { passwords, mainSize, sideSize } = decode(results._id)
    const { passwords: sanitizedPasswords } = (await getDataOmega(passwords))
    const mainDeck = sanitizedPasswords.slice(0, mainSize)
    const sideDeck = sideSize ? sanitizedPasswords.slice(-sideSize) : []

    const data = {
      id: crypto.createHash("sha256").update(results._id).digest("hex").slice(0, 8),
      data: await getDeck(results._id),
      score: calculateScore(results.wins, results.games, results.rating),
      games: results.games,
      wins: results.wins,
      code: results._id, 
      rating: results.rating,
      uniqueUsers: results.uniqueUsersCount,
      passwords: {
        mainDeck,
        sideDeck,
      },
    };

    res.json({ data: await data });
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro ao buscar os decks' });
  }
});

router.get('/update', async (req, res) => {
  res.json({ message: "🚀 Migração iniciada! Acompanhe os logs do servidor." });
  const restart = req.query.restart;
  console.log(restart)
  migrateDecks(restart);
});

router.get('/delete', async (req, res) => {
  const token = req.query.token;

  if (!token || token !== process.env.DELETETOKEN) {
    res.send('Wrong token.')
  } else {
    await connectMongo();
    await Decks.deleteMany({});
    await Users.deleteMany({});
    res.send('🗑️ Todos os registros anteriores foram removidos.');
  }
});

export default router;

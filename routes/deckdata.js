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
    const data = results.map(async ({ games, wins, deck, rating, uniqueUsers }) => ({
      id: crypto.createHash("sha256").update(deck).digest("hex").slice(0, 8),
      data: await getDeck(deck),
      score: calculateScore(wins, games, rating),
      games, wins, code: deck, rating, uniqueUsers,
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
    const { passwords, mainSize, sideSize } = decode(results.deck)
    const { passwords: sanitizedPasswords } = (await getDataOmega(passwords))
    const mainDeck = sanitizedPasswords.slice(0, mainSize)
    const sideDeck = sideSize ? sanitizedPasswords.slice(-sideSize) : []

    const data = {
      id: crypto.createHash("sha256").update(results.deck).digest("hex").slice(0, 8),
      data: await getDeck(results.deck),
      score: calculateScore(results.wins, results.games, results.rating),
      games: results.games,
      wins: results.wins,
      code: results.deck, 
      rating: results.rating,
      uniqueUsers: results.uniqueUsers,
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
  migrateDecks(); // Executa a função em background
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

import crypto from "crypto";
import express from 'express';
import mongoose from 'mongoose';
import Decks from '../models/decks.js'
import { getAllDecks, getDeckStatsPaginated, getDeckStatsByName } from '../utils/deckdata.js';
import { getDeck } from '../utils/decks.js';
import { decode } from '../utils/converter.js'
import { getDataOmega } from '../utils/setcodes.js'
import { connectMongo } from '../utils/db.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    await connectMongo();
    const page = req.query.page || 1;
    const limit = req.query.limit || 24;
    const skip = (page - 1) * limit;

    const data = await getDeckStatsPaginated(Decks, page, limit)

    res.json({ data });
  } catch (error) {
    console.error('❌ Erro ao buscar decks:', error);
    res.status(500).json({ message: 'Erro ao buscar os decks' });
  }
});

router.get('/deck/:deck', async (req, res) => {
  try {
    await connectMongo();
    const deck = req.params.deck;

    const result = await getDeckStatsByName(Decks, deck)
    const { passwords, mainSize, sideSize } = decode(result._id)
    const { passwords: sanitizedPasswords } = (await getDataOmega(passwords))
    const mainDeck = sanitizedPasswords.slice(0, mainSize)
    const sideDeck = sideSize ? sanitizedPasswords.slice(-sideSize) : []

    const data = {
      id: crypto.createHash("sha256").update(result._id).digest("hex").slice(0, 8),
      code: result._id,
      games: result.games,
      wins: result.wins,
      data: await getDeck(result._id),
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
  await connectMongo();
  const decks = await getAllDecks();

  if (decks.length === 0) {
    console.log('⚠️ Nenhum dado para migrar.');
    return;
  }

  try {
    const result = await Decks.insertMany(decks, { ordered: false }); // `ordered: false` continua após erro
    console.log(`✅ ${result.length} novos registros inseridos no MongoDB.`);
  } catch (error) {
    if (error.code === 11000) {
      console.warn('⚠️ Alguns registros já existiam e foram ignorados.');
    } else {
      console.error(error.code, '❌ Erro ao inserir no MongoDB:');
    }
  } finally {
    mongoose.connection.close();
  }
});

router.get('/delete', async (req, res) => {
  await connectMongo();
  await Decks.deleteMany({});
  console.log('🗑️ Todos os registros anteriores foram removidos.');
});


export default router;

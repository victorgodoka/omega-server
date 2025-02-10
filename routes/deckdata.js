import express from 'express';
import mongoose from 'mongoose';
import Decks from '../models/decks.js'
import { getAllDecks, getDeckInfo } from '../utils/deckdata.js';
import { decode } from '../utils/converter.js';
import { connectMongo } from '../utils/db.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    await connectMongo();
    const lastId = req.query.lastId;
    const decks = await Decks.find(lastId ? { _id: { $gt: lastId } } : {})
      .select({ deck1: 1 })
      .limit(24);

    res.json({ data: decks });
  } catch (error) {
    console.error('❌ Erro ao buscar decks:', error);
    res.status(500).json({ message: 'Erro ao buscar os decks' });
  }
});

router.get('/deck/:deck', async (req, res) => {
  try {
    await connectMongo();
    const deck = req.params.deck;
    const result = await Decks.find({
      $or: [
        { deck1: deck },
        { deck2: deck }
      ]
    });

    res.json({ data: result });
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
      console.error('❌ Erro ao inserir no MongoDB:', error);
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

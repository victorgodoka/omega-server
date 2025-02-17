import crypto from "crypto";
import express from 'express';
import mongoose from 'mongoose';
import Decks from '../models/decks.js'
import { getLatestMigratedId, getAllDecksBatch, getDeckStatsPaginated, getDeckStats, getDeckStatsByName } from '../utils/deckdata.js';
import { getDeck } from '../utils/decks.js';
import { decode } from '../utils/converter.js'
import { getDataOmega } from '../utils/setcodes.js'
import pkg from '../utils/functions.cjs';
const { paginateArray, groupDecksByArchetype, addPercentageToData } = pkg;
import { connectMongo } from '../utils/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    await connectMongo();
    const name = req.query.name || "";
    let data = await getDeckStats(Decks)

    if (name) {
      data = data.filter(c => {
        const archetypes = c.data.map(c => c.archetype).map(a => a.toLowerCase()).sort().join(" ");
        return archetypes.includes(name.toLowerCase().split(" ").sort().join(" "));
      });
    }
    res.json({ data });
  } catch (error) {
    console.error('❌ Erro ao buscar decks:', error);
    res.status(500).json({ message: 'Erro ao buscar os decks' });
  }
});

router.get('/all', async (req, res) => {
  try {
    await connectMongo();
    let data = await getDeckStats(Decks)

    res.json({ data: groupDecksByArchetype(data, 1) });
  } catch (error) {
    console.error('❌ Erro ao buscar decks:', error);
    res.status(500).json({ message: 'Erro ao buscar os decks' });
  }
});

router.get('/deck', async (req, res) => {
  try {
    await connectMongo();
    const deck = req.query.deck;

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
      uniquePlayers: result.uniquePlayers,
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

export const migrateDecks = async () => {
  await connectMongo();

  console.log('⏳ Iniciando migração em background...');

  const lastId = await getLatestMigratedId();
  console.log(`📌 Último ID migrado: ${lastId}`);

  let offset = 0;
  const batchSize = 1000;
  let totalMigrated = 0;

  try {
    while (true) {
      const decks = await getAllDecksBatch(offset, batchSize, lastId);
      if (decks.length === 0) break;

      const bulkOps = decks.map(deck => ({
        updateOne: {
          filter: { sqlid: deck.id },
          update: { $set: deck },
          upsert: true
        }
      }));

      const result = await Decks.bulkWrite(bulkOps, { ordered: false });
      totalMigrated += result.upsertedCount + result.modifiedCount;
      offset += batchSize;

      console.log(`✅ ${result.upsertedCount} inseridos, ${result.modifiedCount} atualizados. Total: ${totalMigrated}`);
    }

    console.log(`🎉 Migração concluída! Total: ${totalMigrated}`);
  } catch (error) {
    console.error(`❌ Erro: ${error.message}`);
  } finally {
    mongoose.connection.close();
  }
};

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
    res.send('🗑️ Todos os registros anteriores foram removidos.');
  }
});

export default router;

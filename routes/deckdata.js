import crypto from "crypto";
import express from 'express';
import mongoose from 'mongoose';
import Decks from '../models/decks.js'
import { getLatestMigratedId, getAllDecksBatch, getDeckStatsPaginated, getDeckStatsByName } from '../utils/deckdata.js';
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
  console.log('Iniciando os trabalhos...')
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.write('⏳ Buscando último ID migrado...\n');

  // Pegamos o último ID migrado no MongoDB
  const lastId = await getLatestMigratedId();
  res.write(`📌 Último ID migrado: ${lastId}\n`);

  let offset = 0;
  const batchSize = 1000;
  let totalMigrated = 0;

  try {
    while (true) {
      const decks = await getAllDecksBatch(offset, batchSize, lastId);
      if (decks.length === 0) break; // Parar se não houver mais dados

      const bulkOps = decks.map(deck => ({
        updateOne: {
          filter: { id: deck.id }, // ID único do MySQL
          update: { $set: deck },  // Atualiza se existir, insere se não existir
          upsert: true
        }
      }));

      const result = await Decks.bulkWrite(bulkOps, { ordered: false });
      totalMigrated += result.upsertedCount + result.modifiedCount;
      offset += batchSize;

      res.write(`✅ ${result.upsertedCount} inseridos, ${result.modifiedCount} atualizados. Total: ${totalMigrated}\n`);
    }

    res.write(`🎉 Migração concluída! Total: ${totalMigrated}\n`);
  } catch (error) {
    res.write(`❌ Erro: ${error.message}\n`);
  } finally {
    mongoose.connection.close();
    res.end();
  }
});

router.get('/delete', async (req, res) => {
  await connectMongo();
  await Decks.deleteMany({});
  console.log('🗑️ Todos os registros anteriores foram removidos.');
});


export default router;

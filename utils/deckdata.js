import { connectMongo } from './db.js';
import db from './db.js';
import crypto from "crypto";
import { getDeck } from './decks.js';
import pkg from './functions.cjs';
const { calculateDeckScore } = pkg;
import Decks from '../models/decks.js'
import Users from '../models/users.js'
import mongoose from 'mongoose';

const LASTBANLIST = '2024-12-09'

export const getAllDecks = async () => {
  const query = `
  SELECT *
  FROM omega.duel
  WHERE start >= '${LASTBANLIST}' AND region = 1
  ORDER BY start DESC;
`;

  const [rows] = await db.execute(query);
  return rows
}

export const getLatestMigratedId = async (restart) => {
  const lastDeck = await Decks.findOne().sort({ sqlid: -1 }).select('sqlid').lean();
  return restart ? await getFirst() : (lastDeck?.sqlid || await getFirst());
};

export const getFirst = async () => {
  const query = `SELECT * FROM omega.duel WHERE start >= '${LASTBANLIST}' ORDER BY start ASC LIMIT 1;
`;
  const [rows] = await db.execute(query);
  return rows[0].id;
};

export const getAllDecksBatch = async (offset, limit, lastId) => {
  const query = `
    SELECT 
      d.*,
      CAST (d.duelist1 AS CHAR) as duelist1,
      CAST (d.duelist2 AS CHAR) as duelist2,
      u1.tcgrating AS duelist1Rating,
      u2.tcgrating AS duelist2Rating
    FROM omega.duel d
    LEFT JOIN omega.user u1 ON d.duelist1 = u1.id
    LEFT JOIN omega.user u2 ON d.duelist2 = u2.id
    WHERE d.id > ? AND d.region = 1 AND d.start >= '${LASTBANLIST}'
    ORDER BY d.id ASC
    LIMIT ? OFFSET ?;
  `;

  const [rows] = await db.execute(query, [lastId, limit, offset]);
  return rows;
};

export const getDeckInfo = async (deck) => {
  const query = `
  SELECT *
  FROM omega.duel
  WHERE start >= '${LASTBANLIST}' AND region = 1 AND (deck1 = "${deck}" OR deck2 = "${deck}")
  ORDER BY start DESC;
`;

  const [rows] = await db.execute(query);
  return rows
}

export const getDeckStatsPaginated = async (model, page = 1, limit = 24, name = "") => {
  const pipeline = [
    {
      $facet: {
        allGames: [
          {
            $group: {
              _id: "$deck1",
              games: { $sum: 1 },
              wins: { $sum: { $cond: [{ $eq: ["$result", 0] }, 1, 0] } }
            }
          },
          {
            $unionWith: {
              coll: 'duels', // Nome da coleção no MongoDB
              pipeline: [
                {
                  $group: {
                    _id: "$deck2",
                    games: { $sum: 1 },
                    wins: { $sum: { $cond: [{ $eq: ["$result", 1] }, 1, 0] } }
                  }
                }
              ]
            }
          },
          {
            $group: {
              _id: "$_id",
              games: { $sum: "$games" },
              wins: { $sum: "$wins" }
            }
          },
          { $match: { games: { $gte: 10 } } },
          { $sort: { games: -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit }
        ],
        totalCount: [
          {
            $group: {
              _id: "$deck1"
            }
          },
          {
            $unionWith: {
              coll: 'duels',
              pipeline: [
                {
                  $group: {
                    _id: "$deck2"
                  }
                }
              ]
            }
          },
          {
            $group: {
              _id: null, // Agrupa todos os decks juntos
              total: { $sum: 1 }
            }
          }
        ]
      }
    },
    {
      $project: {
        paginatedResults: "$allGames",
        totalCount: { $arrayElemAt: ["$totalCount.total", 0] } // ✅ CORREÇÃO AQUI
      }
    }
  ];

  const results = await model.aggregate(pipeline).exec();

  const data = await Promise.all(results[0].paginatedResults.map(async deck => ({
    id: crypto.createHash("sha256").update(deck._id).digest("hex").slice(0, 8),
    code: deck._id,
    games: deck.games,
    wins: deck.wins,
    data: await getDeck(deck._id)
  })));

  const total = results[0].totalCount || 0;
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    page: parseInt(page),
    limit,
    total,
    totalPages,
    hasNextPage: page * limit < total,
    hasPrevPage: page > 1
  };
};

export const getDeckStatsByName = async (model, deckName) => {
  const pipeline = [
    {
      $facet: {
        deckStats: [
          {
            $match: {
              $or: [{ deck1: deckName }, { deck2: deckName }] // Filtra apenas jogos onde o deck foi usado
            }
          },
          {
            $group: {
              _id: deckName,
              games: { $sum: 1 },
              wins: {
                $sum: {
                  $cond: [
                    {
                      $or: [
                        { $and: [{ $eq: ["$deck1", deckName] }, { $eq: ["$result", 0] }] }, // deck1 venceu
                        { $and: [{ $eq: ["$deck2", deckName] }, { $eq: ["$result", 1] }] } // deck2 venceu
                      ]
                    },
                    1, // Conta como vitória
                    0  // Caso contrário, não conta
                  ]
                }
              },
              playersUsingDeck: {
                $addToSet: {
                  $cond: [
                    { $eq: ["$deck1", deckName] }, // Se o deck pesquisado foi usado por `duelist1`
                    "$duelist1",
                    "$duelist2"
                  ]
                }
              }
            }
          },
          {
            $project: {
              games: 1,
              wins: 1,
              uniquePlayers: { $size: "$playersUsingDeck" } // Conta os duelistas únicos que usaram esse deck
            }
          }
        ]
      }
    },
    {
      $project: {
        deckStats: { $arrayElemAt: ["$deckStats", 0] } // Pega o primeiro (e único) elemento do array
      }
    }
  ];

  const results = await model.aggregate(pipeline).exec();

  return results[0].deckStats || { deckName, games: 0, wins: 0, uniquePlayers: 0 };
};

export const getDeckStats = async (deckName = null) => {
  const tempCollection = 'temp_deck_stats';

  try {
    // Filtro para duelos envolvendo o deck especificado (se fornecido)
    const matchStage = deckName
      ? { $match: { $or: [{ deck1: deckName }, { deck2: deckName }] } }
      : { $match: {} };

    // Processa as estatísticas de deck1 e armazena na coleção temporária
    await Decks.aggregate([
      matchStage,
      {
        $group: {
          _id: '$deck1',
          games: { $sum: 1 },
          wins: {
            $sum: {
              $cond: [{ $eq: ['$result', 0] }, 1, 0]
            }
          },
          totalRating: { $sum: '$duelRating' },
          uniqueUsers: { $addToSet: '$duelist1' }, // Adiciona duelist1 ao conjunto
          lastDuel: { $max: '$start' }
        }
      },
      {
        $merge: {
          into: tempCollection,
          whenMatched: 'merge', // Combina os resultados se o documento já existir
          whenNotMatched: 'insert' // Insere um novo documento se não existir
        }
      }
    ]);

    // Processa as estatísticas de deck2 e armazena na coleção temporária
    await Decks.aggregate([
      matchStage,
      {
        $group: {
          _id: '$deck2',
          games: { $sum: 1 },
          wins: {
            $sum: {
              $cond: [{ $eq: ['$result', 1] }, 1, 0]
            }
          },
          totalRating: { $sum: '$duelRating' },
          uniqueUsers: { $addToSet: '$duelist2' }, // Adiciona duelist2 ao conjunto
          lastDuel: { $max: '$start' }
        }
      },
      {
        $merge: {
          into: tempCollection,
          whenMatched: 'merge', // Combina os resultados se o documento já existir
          whenNotMatched: 'insert' // Insere um novo documento se não existir
        }
      }
    ]);

    // Combina os resultados da coleção temporária e aplica os filtros finais
    const result = await mongoose.connection.collection(tempCollection).aggregate([
      {
        $group: {
          _id: '$_id',
          games: { $sum: '$games' },
          wins: { $sum: '$wins' },
          totalRating: { $sum: '$totalRating' },
          uniqueUsers: { $push: '$uniqueUsers' }, // Agrupa os arrays de usuários únicos
          lastDuel: { $max: '$lastDuel' }
        }
      },
      {
        $addFields: {
          rating: { $divide: ['$totalRating', '$games'] },
          winRate: { $divide: ['$wins', '$games'] },
          uniqueUsers: {
            $reduce: {
              input: '$uniqueUsers',
              initialValue: [],
              in: { $setUnion: ['$$value', '$$this'] } // Une os arrays e remove duplicatas
            }
          }
        }
      },
      {
        $addFields: {
          uniqueUsersCount: { $size: '$uniqueUsers' } // Calcula o número de usuários únicos
        }
      },
      {
        $match: {
          $or: [
            { games: { $gte: 25 }, rating: { $gte: 200 }, winRate: { $gte: 0.45 } }
          ]
        }
      }
    ]).toArray();

    return result;
  } catch (error) {
    console.error('Erro ao buscar estatísticas dos decks:', error);
    throw error;
  } finally {
    // Limpa a coleção temporária, se existir
    const collections = await mongoose.connection.db.listCollections({ name: tempCollection }).toArray();
    if (collections.length > 0) {
      await mongoose.connection.collection(tempCollection).drop();
    }
  }
};

export const migrateDecks = async (restart) => {
  await connectMongo();

  console.log('⏳ Iniciando migração em background...');

  const lastId = await getLatestMigratedId(restart);
  console.log(`📌 Último ID migrado: ${lastId}`);

  let offset = 0;
  const batchSize = 2500;
  let totalMigrated = 0;

  try {
    while (true) {
      const decks = await getAllDecksBatch(offset, batchSize, lastId);
      if (decks.length === 0) break;
      const bulkOps = decks.map(deck => ({
        updateOne: {
          filter: { sqlid: deck.id },
          update: {
            $set: {
              sqlid: deck.id,
              duelist1: deck.duelist1,
              duelist2: deck.duelist2,
              result: deck.result,
              deck1: deck.deck1,
              deck2: deck.deck2,
              start: deck.start,
              end: deck.end,
              duelist1Rating: deck.duelist1Rating,
              duelist2Rating: deck.duelist2Rating,
              duelRating: (deck.duelist1Rating + deck.duelist2Rating) / 2
            }
          },
          upsert: true
        }
      }));

      const result = await Decks.bulkWrite(bulkOps, { ordered: false });
      totalMigrated += result.upsertedCount + result.modifiedCount;
      offset += batchSize;

      console.log(`✅ ${result.upsertedCount} duelos inseridos, ${result.modifiedCount} atualizados. Total: ${totalMigrated}`);
    }

    console.log(`🎉 Migração concluída! Total: ${totalMigrated}`);
  } catch (error) {
    console.error(`❌ Erro: ${error.message}`);
  } finally {
    mongoose.connection.close();
  }
};

export const calculateScore = (wins, games, avgRating, maxRating = 2000) => {
  if (games === 0) return 0; // Evita divisão por zero

  const winRate = wins / games; // Win rate
  const gamesWeight = Math.log(games + 1); // Ponderação pelo número de jogos
  const ratingWeight = avgRating / maxRating; // Ponderação pelo rating médio

  // Fórmula de score combinada
  const score = (winRate * gamesWeight) * ratingWeight;

  return score;
};
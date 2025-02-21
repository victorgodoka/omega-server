import { connectMongo } from './db.js';
import db from './db.js';
import crypto from "crypto";
import { getDeck } from './decks.js';
import pkg from './functions.cjs';
const { calculateDeckScore } = pkg;
import Decks from '../models/decks.js'
import Users from '../models/users.js'

export const getAllDecks = async () => {
  const query = `
  SELECT *
  FROM omega.duel
  WHERE start > '2024-12-09' AND region = 1
  ORDER BY start DESC;
`;

  const [rows] = await db.execute(query);
  return rows
}

export const getLatestMigratedId = async () => {
  const lastDeck = await Decks.findOne().sort({ sqlid: -1 }).select('sqlid').lean();
  return lastDeck?.sqlid || await getFirst();
};

export const getFirst = async () => {
  const query = `SELECT * FROM omega.duel WHERE start >= '2024-12-09' ORDER BY start ASC LIMIT 1;
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
    WHERE d.id > ? AND d.region = 1
      AND u1.tcgrating >= 350
      AND u2.tcgrating >= 350
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
  WHERE start >= '2024-12-09' AND region = 1 AND (deck1 = "${deck}" OR deck2 = "${deck}")
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

// export const getDeckStats = async (model) => {
//   const results = await model.aggregate([
//     {
//       $lookup: {
//         from: "users",
//         localField: "duelist1",
//         foreignField: "id",
//         as: "duelist1Data",
//       },
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "duelist2",
//         foreignField: "id",
//         as: "duelist2Data",
//       },
//     },
//     {
//       $unwind: "$duelist1Data",
//     },
//     {
//       $unwind: "$duelist2Data",
//     },
//     {
//       $facet: {
//         deck1Stats: [
//           {
//             $group: {
//               _id: "$deck1",
//               deck: { $first: "$deck1" },
//               games: { $sum: 1 },
//               wins: {
//                 $sum: {
//                   $cond: [{ $eq: ["$result", 0] }, 1, 0],
//                 },
//               },
//               totalRating: {
//                 $sum: {
//                   $max: [
//                     0, // Garante que não haja valores negativos
//                     { $divide: [{ $add: ["$duelist1Data.tcgrating", "$duelist2Data.tcgrating"] }, 2] }
//                   ]
//                 },
//               },
//             },
//           },
//         ],
//         deck2Stats: [
//           {
//             $group: {
//               _id: "$deck2",
//               deck: { $first: "$deck2" },
//               games: { $sum: 1 },
//               wins: {
//                 $sum: {
//                   $cond: [{ $eq: ["$result", 1] }, 1, 0],
//                 },
//               },
//               totalRating: {
//                 $sum: {
//                   $max: [
//                     0,
//                     { $divide: [{ $add: ["$duelist1Data.tcgrating", "$duelist2Data.tcgrating"] }, 2] }
//                   ]
//                 },
//               },
//             },
//           },
//         ],
//       },
//     },
//     {
//       $project: {
//         combinedStats: {
//           $concatArrays: ["$deck1Stats", "$deck2Stats"],
//         },
//       },
//     },
//     {
//       $unwind: "$combinedStats",
//     },
//     {
//       $replaceRoot: { newRoot: "$combinedStats" },
//     },
//     {
//       $project: {
//         _id: 0,
//         id: "$_id",
//         deck: 1,
//         games: 1,
//         wins: 1,
//         rating: {
//           $cond: [
//             { $eq: ["$games", 0] },
//             0,
//             { $divide: ["$totalRating", "$games"] }
//           ],
//         },
//       },
//     },
//   ]);


//   // const data = await Promise.all(
//   //   results.map(async (deck, _, arr) => ({
//   //     id: crypto.createHash("sha256").update(deck._id).digest("hex").slice(0, 8),
//   //     code: deck._id,
//   //     games: deck.games,
//   //     wins: deck.wins,
//   //     data: await getDeck(deck._id),
//   //     winRate: deck.wins / deck.games,
//   //     popularity: deck.games / arr.reduce((a, b) => a + b.games, 0),
//   //     rating: calculateDeckScore(deck.games, deck.wins, arr.reduce((a, b) => a + b.games, 0))
//   //   }))
//   // );

//   return results;
// };

export const getDeckStats = async (deckName = null) => {
  try {
    // Filtra os duelos que envolvem o deck especificado (se fornecido)
    const matchStage = deckName
      ? {
        $match: {
          $or: [
            { deck1: deckName },
            { deck2: deckName }
          ]
        }
      }
      : { $match: {} }; // Se nenhum nome for passado, pega todos os duelos

    const result = await Decks.aggregate([
      // Filtra os duelos
      matchStage,
      // Agrupa os duelos por deck
      {
        $facet: {
          deck1Stats: [
            {
              $group: {
                _id: '$deck1',
                games: { $sum: 1 },
                wins: {
                  $sum: {
                    $cond: [
                      { $eq: ['$result', 0] }, // Vitória do duelist1 (deck1)
                      1,
                      0
                    ]
                  }
                },
                totalRating: { $sum: '$duelRating' },
                uniqueUsers: { $addToSet: '$duelist1' } // Armazena duelist1 únicos
              }
            }
          ],
          deck2Stats: [
            {
              $group: {
                _id: '$deck2',
                games: { $sum: 1 },
                wins: {
                  $sum: {
                    $cond: [
                      { $eq: ['$result', 1] }, // Vitória do duelist2 (deck2)
                      1,
                      0
                    ]
                  }
                },
                totalRating: { $sum: '$duelRating' },
                uniqueUsers: { $addToSet: '$duelist2' } // Armazena duelist2 únicos
              }
            }
          ]
        }
      },
      // Combina os resultados de deck1Stats e deck2Stats
      {
        $project: {
          allDecks: {
            $concatArrays: ['$deck1Stats', '$deck2Stats']
          }
        }
      },
      // Desestrutura o array combinado
      {
        $unwind: '$allDecks'
      },
      // Agrupa novamente para somar as estatísticas de cada deck
      {
        $group: {
          _id: '$allDecks._id',
          games: { $sum: '$allDecks.games' },
          wins: { $sum: '$allDecks.wins' },
          totalRating: { $sum: '$allDecks.totalRating' },
          uniqueUsers: { $addToSet: '$allDecks.uniqueUsers' } // Combina arrays de usuários únicos
        }
      },
      // Calcula o número de usuários únicos
      {
        $project: {
          id: '$_id',
          deck: '$_id',
          games: 1,
          wins: 1,
          rating: { $divide: ['$totalRating', '$games'] },
          uniqueUsers: {
            $size: {
              $setUnion: '$uniqueUsers' // Une os arrays e conta os usuários únicos
            }
          }
        }
      },
      // Filtra decks com mais de 10 jogos
      {
        $match: {
          games: { $gt: 10 } // Apenas decks com mais de 10 jogos
        }
      }
    ]);

    return result;
  } catch (error) {
    console.error('Erro ao buscar estatísticas dos decks:', error);
    throw error;
  }
};

export const migrateDecks = async () => {
  await connectMongo();

  console.log('⏳ Iniciando migração em background...');

  const lastId = await getLatestMigratedId();
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
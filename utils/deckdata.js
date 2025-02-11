import db from './db.js';
import crypto from "crypto";
import { getDeck } from './decks.js';
import Decks from '../models/decks.js'

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
  const lastDeck = await Decks.findOne().sort({ id: -1 }).select('id').lean();
  return lastDeck?.id || 4878525; 
};

export const getAllDecksBatch = async (offset, limit, lastId) => {
  const query = `
  SELECT *
  FROM omega.duel
  WHERE id > ? AND region = 1
  ORDER BY id ASC
  LIMIT ? OFFSET ?;
  `;

  const [rows] = await db.execute(query, [lastId, limit, offset]);
  return rows;
};

export const getDeckInfo = async (deck) => {
  const query = `
  SELECT *
  FROM omega.duel
  WHERE start > '2024-12-09' AND region = 1 AND (deck1 = "${deck}" OR deck2 = "${deck}")
  ORDER BY start DESC;
`;

  const [rows] = await db.execute(query);
  return rows
}

export const getDeckStatsPaginated = async (model, page = 1, limit = 24) => {
  const collectionName = model.collection.name; // Nome da coleção no Mongoose

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
              coll: collectionName, // Nome da coleção no MongoDB
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
              coll: collectionName,
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

  const data = results[0].paginatedResults.map(async deck => ({
    id: crypto.createHash("sha256").update(deck._id).digest("hex").slice(0, 8),
    code: deck._id,
    games: deck.games,
    wins: deck.wins,
    data: await getDeck(deck._id)
  }));

  const total = results[0].totalCount || 0;
  const totalPages = Math.ceil(total / limit);

  return {
    data: await Promise.all(data),
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
              $or: [{ deck1: deckName }, { deck2: deckName }] // Filtra pelo deck passado
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
                      $or: [{ $and: [{ $eq: ["$deck1", deckName] }, { $eq: ["$result", 0] }] }, // deck1 venceu
                      { $and: [{ $eq: ["$deck2", deckName] }, { $eq: ["$result", 1] }] } // deck2 venceu
                      ]
                    },
                    1, // Conta como vitória
                    0  // Caso contrário, não conta
                  ]
                }
              }
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

  return results[0].deckStats || { deckName, games: 0, wins: 0 };
};

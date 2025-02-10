import db from './db.js';

export const getAllDecks = async () => {
  const query = `
  SELECT *
  FROM omega.duel
  WHERE start > '2024-12-09' AND region = 1;
`;

  const [rows] = await db.execute(query);
  return rows
}

export const getDeckInfo = async (deck) => {
  const query = `
  SELECT *
  FROM omega.duel
  WHERE start > '2024-12-09' AND region = 1 AND (deck1 = "${deck}" OR deck2 = "${deck}");
`;

  const [rows] = await db.execute(query);
  return rows
}

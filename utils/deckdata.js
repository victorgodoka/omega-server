import db from './db.js';

export const getAllDecks = async () => {
  const query = `
SELECT DISTINCT deck1 AS deck
FROM omega.duel
WHERE start > '2024-12-09'

UNION

SELECT DISTINCT deck2 AS deck
FROM omega.duel
WHERE start > '2024-12-09'
`;

  const [rows] = await db.execute(query);
  return rows
}

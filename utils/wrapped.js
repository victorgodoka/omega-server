import db from './db.js';
import { decode } from '../utils/converter.js';

export const getWrappedData = async (duelistId) => {
  const query = `
    SELECT 
      CAST (? AS CHAR) AS duelist,
      CASE 
        WHEN d.duelist1 = ? THEN d.deck1
        ELSE d.deck2
      END AS duelistDeck,
      u.username AS opponentUsername,
      u.displayName AS opponentDisplayName,
      u.avatar AS opponentAvatar,
      CASE 
        WHEN d.duelist1 = ? THEN CAST (d.deck2 AS CHAR)
        ELSE CAST (d.deck1 AS CHAR)
      END AS opponentDeck,
      d.start, 
      d.\`end\`
    FROM omega.duel d
    LEFT JOIN omega.user_discord_data u 
      ON (d.duelist1 = ? AND u.discord_id = d.duelist2) 
        OR (d.duelist2 = ? AND u.discord_id = d.duelist1)
    WHERE (d.duelist1 = ? OR d.duelist2 = ?)
      AND d.start >= '2024-01-01'
      AND d.region = 1;
  `

  const [rows] = await db.execute(query.replaceAll('?', duelistId));
  return rows;
}

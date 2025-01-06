import db from './db.js';

export const getLeaderboard = async (ot) => {
  const query = `
    SELECT 
      CAST(x.id AS CHAR) as id,
      u.username,
      u.avatar,
      u.displayname,
      x.tcgrating,
      x.tcgwinstreak,
      x.tcglosestreak,
      x.ocgrating,
      x.ocgwinstreak,
      x.ocglosestreak,
      (SELECT COUNT(*) FROM omega.duel o WHERE (o.duelist1 = x.id) OR (o.duelist2 = x.id)) AS duels,
      (SELECT COUNT(*) FROM omega.duel o WHERE (o.duelist1 = x.id AND o.result = 0) OR (o.duelist2 = x.id AND o.result = 1)) AS wins
    FROM omega.user x 
    JOIN omega.user_discord_data u ON x.id = u.discord_id
    ORDER BY x.${ot}rating DESC
    LIMIT 50;
  `;
  
  const [rows] = await db.execute(query);
  return rows
};

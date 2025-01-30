import db from './db.js';

export const getLeaderboard = async (ot) => {
  const query = `
    SELECT
      CAST(x.id AS CHAR) as id,
      u.username,
      u.avatar,
      u.displayname,
      x.${ot}wins as wins,
      x.${ot}loses as loses,
      x.${ot}draws as draws,
      x.${ot}rating as rating,
      x.${ot}winstreak as winstreak,
      x.${ot}losestreak as losestreak,
      (x.${ot}wins + x.${ot}loses + x.${ot}draws) as games
    FROM omega.user x
    JOIN omega.user_discord_data u ON x.id = u.discord_id
    HAVING games > 0
    ORDER BY x.${ot}rating DESC
    LIMIT 100;
  `;
  
  const [rows] = await db.execute(query);
  return rows
};


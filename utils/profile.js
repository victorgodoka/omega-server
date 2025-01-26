import db from './db.js';

export const getProfile = async (duelistId) => {
  const query = `
    SELECT 
      CAST (x.discord_id AS CHAR) AS id, x.username, x.displayname, x.avatar, u.tcgwins, u.tcgloses, u.tcgdraws, u.ocgwins, u.ocgloses, u.ocgdraws, u.tcgrating, u.ocgrating, u.lastlogin, u.accountrank
    FROM omega.user_discord_data x
    LEFT JOIN omega.user u ON x.discord_id = u.id
    WHERE x.discord_id = ?
  `;
  const [rows] = await db.execute(query, [duelistId]); // Passando o parâmetro como um array
  return rows;
}

import db from './db.js';

export const getLastLogins = async (ot) => {
  const query = `
    SELECT
        DATE(DATE(CONVERT_TZ(date, @@session.time_zone, @@global.time_zone))) AS dia,
        unique_logins AS count
    FROM
        omega.usage_stats
    GROUP BY
        dia;
  `;

  const [rows] = await db.execute(query);
  return rows
};

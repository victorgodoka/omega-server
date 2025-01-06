import db from './db.js';

export const getLastLogins = async (ot) => {
  const query = `
    SELECT
        DATE(DATE(CONVERT_TZ(lastlogin, @@session.time_zone, @@global.time_zone))) AS dia,
        COUNT(*) AS count
    FROM
        omega.user
    GROUP BY
        dia;
  `;

  const [rows] = await db.execute(query);
  return rows
};

import express from 'express'
import mysql from 'mysql2/promise';

const router = express.Router();
const pool = mysql.createPool({
  host: 'game.duelistsunite.org',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'omega'
});

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const size = parseInt(req.query.size) || 25; 
    const offset = (page - 1) * size;

    const [rows] = await pool.query(
      `
       SELECT
        d.id,
        CASE
            WHEN d.result = 0 THEN CAST(d.duelist1 AS CHAR)
            WHEN d.result = 1 THEN CAST(d.duelist2 AS CHAR)
        END AS duelist,
        u.username,
        u.avatar,
        u.displayname,
        CASE
            WHEN d.result = 0 THEN d.deck1
            WHEN d.result = 1 THEN d.deck2
        END AS deck
      FROM omega.duel d
      LEFT JOIN omega.user_discord_data u
        ON u.discord_id = CASE
            WHEN d.result = 0 THEN d.duelist1
            WHEN d.result = 1 THEN d.duelist2
        END
      WHERE d.region = 1 AND d.start > '2024-08-01'
      ORDER BY d.start DESC
      LIMIT ? OFFSET ?;
      `,
      [size, offset]
    );

    const [totalRowsResult] = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM omega.duel d
      WHERE d.region = 1 AND d.start > '2024-08-01'
      `
    );
    const totalRows = totalRowsResult[0].total;
    const totalPages = Math.ceil(totalRows / size);
    
    res.json({
      data: rows,
      meta: {
        currentPage: page,
        totalPages,
        totalRows,
        size
      }
    });
  }
  catch (error) {
    console.error('Erro ao buscar dados:', error);
    res.status(500).json({ mensagem: 'Server error.' });
  }
})

export default router;

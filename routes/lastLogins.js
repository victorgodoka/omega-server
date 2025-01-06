import express from 'express';
import { getLastLogins } from '../utils/lastLogins.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const rows = await getLastLogins()

    const logins = rows.map(row => ({
      LogDate: row.dia,
      LogCount: Number(row.count),
    }));

    const total = rows.reduce((a, b) => Number(b.count) + a, 0)

    res.status(200).json({ data: { logins, total } });

  } catch (error) {
    console.error("Erro ao buscar logins:", error);
    res.status(500).json({ error: "Erro ao buscar logins" });
  }
});

export default router;

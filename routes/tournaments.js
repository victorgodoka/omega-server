import express from 'express';
import { getAllTournament, getTournament } from '../utils/tournament.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const rows = await getAllTournament()
    res.status(200).json({ data: rows });

  } catch (error) {
    console.error("Erro ao buscar logins:", error);
    res.status(500).json({ error: "Erro ao buscar logins" });
  }
});

router.get('/live', async (req, res) => {
  try {
    const allTournaments = await getAllTournament()
    const rows = await getTournament(allTournaments[0].id)
    res.status(200).json({ data: rows });
  } catch (error) {
    console.error("Erro ao buscar logins:", error);
    res.status(500).json({ error: "Erro ao buscar logins" });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const rows = await getTournament(id)
    res.status(200).json({ data: rows });
  } catch (error) {
    console.error("Erro ao buscar logins:", error);
    res.status(500).json({ error: "Erro ao buscar logins" });
  }
});

export default router;

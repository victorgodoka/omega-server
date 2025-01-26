import express from 'express';
import { getProfile } from '../utils/profile.js'

const router = express.Router();

router.get('/', async (req, res) => {
  const { id } = req.query;
  try {
    if (!id) return res.status(200).json({ success: false, message: 'ID not found' })
    const rows = await getProfile(id)

    if (!rows[0]) return res.status(200).json({ success: false, message: 'User not found' })
    return res.status(200).json({ data: { success: true, ...rows[0] } })
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return res.status(500).json({ success: false, mensagem: 'Servidor error.' });
  }
})

export default router
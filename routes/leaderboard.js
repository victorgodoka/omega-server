import express from 'express';
import * as leaderboard from '../utils/leaderboard.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const TCG = await leaderboard.getLeaderboard('tcg');
    const OCG = await leaderboard.getLeaderboard('ocg');

    res.status(200).json({
      success: true,
      message: 'Decks fetched successfully.',
      data: { TCG, OCG }
    });

  } catch (error) {
    console.error('Error fetching decks:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching decks.',
      data: null,
    });
  }

});

export default router;
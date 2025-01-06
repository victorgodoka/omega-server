import express from 'express';
import * as wrapped from '../utils/wrapped.js';
import { decode } from '../utils/converter.js';
import { contarRepeticoes, convertTodeck } from '../utils/decks.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const id = req.query.id;
  
  try {
    const wrappedData = await wrapped.getWrappedData(id);
    let history = wrappedData.map(d => decode(d.duelistDeck).passwords).flat()
    let opponentsDecks = wrappedData.map(d => decode(d.opponentDeck).passwords).flat()
    let decks = await convertTodeck(history, true)
    let opponents = await convertTodeck(opponentsDecks, true)
    
    res.status(200).json({
      success: true,
      message: 'Decks fetched successfully.',
      data: {
        mostUsed: decks.mostUsed,
        history: {
          duels: wrappedData.length,
          opponentsDecks: opponents.mostUsed,
          opponents: contarRepeticoes(wrappedData.map(c => c.opponentUsername), true)
        }
      },
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
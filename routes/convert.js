import { decode, encode } from '../utils/converter.js';
import express from 'express';
import { decodeDeck, getDataOmega } from '../utils/setcodes.js';
import * as ydke from "ydke";

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { code } = req.query
    const deck = decode(code)

    res.status(200).json({
      success: true,
      message: 'Decks fetched successfully.',
      data: {
        mainDeck: (await getDataOmega(deck.passwords.slice(0, deck.mainSize))).data.filter(c => !c.isExtra),
        extraDeck: (await getDataOmega(deck.passwords.slice(0, deck.mainSize))).data.filter(c => c.isExtra),
        sideDeck: deck.sideSize ? (await getDataOmega(deck.passwords.slice(-deck.sideSize))).data : [],
        passwords: (await getDataOmega(deck.passwords)).passwords,
        setcodes: await decodeDeck(deck.passwords),
        set: await decodeDeck(deck.passwords),
        ...deck, 
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching decks.',
      data: error,
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { mainSize, sideSize, passwords, main, extra, side } = req.body

    const ydkeCode = ydke.toURL({
      main: Uint32Array.from(main),
      extra: Uint32Array.from(extra),
      side: Uint32Array.from(side),
    });

    const omegaCode = encode(mainSize, sideSize, passwords)

    res.status(200).json({
      success: true,
      message: 'Decks fetched successfully.',
      data: { ydkeCode, omegaCode }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching decks.',
      data: error,
    });
  }
});

export default router;
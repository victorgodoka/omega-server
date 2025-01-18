import express from 'express';
import { decode } from '../utils/converter.js';
import { contarRepeticoes, getData } from '../utils/decks.js';
import axios from 'axios';

const fetchDecks = async () => {
  const url = 'http://localhost:8080/api/rest/decks';

  try {
    // Faz a requisição e armazena a resposta
    const response = await axios.get(url, {
      headers: {
        'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
      },
    });

    // Armazena os dados na variável
    const decks = response.data;

    // Retorna os decks para uso
    return decks;
  } catch (error) {
    console.error('Erro ao buscar decks:', error.response?.data || error.message);
    throw error; // Relança o erro caso precise tratá-lo em outro lugar
  }
};

const router = express.Router();

router.get('/', async (req, res) => {
  const top = parseInt(req.query.top) || 16;

  const start = Date.now();
  try {
    const { distinct_decks: rows } = await fetchDecks()
    const decks = rows.map(({ deck }) => {
      const { passwords, sideSize } = decode(deck)

      return passwords.slice(-sideSize)
    })

    const decksVariation = decks.map(side => contarRepeticoes(side)).flat()

    const cardData = Object.values(
      decksVariation.reduce((acc, { id, qtd }) => {
        if (!acc[id]) {
          acc[id] = { id, oneEle: 0, twoEle: 0, threeEle: 0, total: 0 };
        }
        if (qtd === 1) acc[id].oneEle += 1;
        if (qtd === 2) acc[id].twoEle += 1;
        if (qtd === 3) acc[id].threeEle += 1;

        const { oneEle, twoEle, threeEle } = acc[id]
        acc[id].total = oneEle + twoEle + threeEle
        return acc;
      }, {})
    )

    const cardInfo = getData(cardData.map(({ id }) => id)).map(({ archetype, id, name }) => ({ archetype, id, name }))
    const data = cardData.map(data => ({
      ...data,
      ...cardInfo.find(({ id }) => id === data.id)
    })).sort((b, a) => a.total - b.total);

    const topData = data.slice(0, top)

    const duration = (Date.now() - start) / 1000;
    res.status(200).json({
      duration: `${duration.toFixed(2)} seconds`,
      data: {
        topData,
        totalDecks: rows.length
      }
    });

  } catch (error) {
    const duration = (Date.now() - start) / 1000;
    res.status(500).json({ duration: `${duration.toFixed(2)} seconds`, error: error.message });
  }
});

export default router;

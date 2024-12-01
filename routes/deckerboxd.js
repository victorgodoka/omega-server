import express from 'express';
import * as deckerboxd from '../utils/deckerboxd.js';

const router = express.Router();

router.get('/decks', async (req, res) => {
  const page = parseInt(req.query.page) || 1;

  try {
    const decks = await deckerboxd.getPagedDecks(page);

    res.status(200).json({
      success: true,
      message: 'Decks fetched successfully.',
      data: decks,
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

router.post('/decks', async (req, res) => {
  const { userId, name, coverCardId, mainCards, tags, allowComments } = req.body;

  if (!userId || !name || !coverCardId || !mainCards || !mainCards.length || tags === undefined) {
    return res.status(400).json({
      success: false,
      message: 'User ID, name, cover card, main cards, and tags are required.',
      data: null,
    });
  }

  try {
    // Gerar um ID único para o deck
    const deckId = `${Date.now()}-${userId}`;

    // Adicionar o deck à base de dados
    await deckerboxd.createDeck(deckId, userId, name, coverCardId, mainCards, tags, allowComments);

    // Retornar sucesso
    res.status(201).json({
      success: true,
      message: 'Deck created successfully.',
      data: { deckId },
    });
  } catch (error) {
    console.error('Error creating deck:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the deck.',
      data: null,
    });
  }
});

router.delete('/decks/:id', async (req, res) => {
  const { id: deckId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID is required.',
      data: null,
    });
  }

  try {
    const deck = await deckerboxd.getDeckById(deckId);

    if (!deck) {
      return res.status(404).json({
        success: false,
        message: 'Deck not found.',
        data: null,
      });
    }

    if (deck.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own decks.',
        data: null,
      });
    }

    await deckerboxd.deleteDeck(deckId);

    res.status(200).json({
      success: true,
      message: 'Deck deleted successfully.',
      data: null,
    });
  } catch (error) {
    console.error('Error deleting deck:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the deck.',
      data: null,
    });
  }
});

router.get('/decks/all', async (req, res) => {
  try {
    const decks = await deckerboxd.getAllDecks();
    res.status(200).json({
      success: true,
      message: 'Decks fetched successfully.',
      data: decks,
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

router.get('/decks/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deck = await deckerboxd.getDeckById(id);

    if (!deck) {
      return res.status(404).json({
        success: false,
        message: 'Deck not found.',
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Deck fetched successfully.',
      data: deck,
    });
  } catch (error) {
    console.error('Error fetching deck:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the deck.',
      data: null,
    });
  }
});

router.post('/decks/:id/like', async (req, res) => {
  const { id: deckId } = req.params;
  const { userId } = req.body; // O ID do usuário vem no corpo da requisição

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID is required.',
      data: null,
    });
  }

  try {
    // Verifica se o usuário já curtiu o deck
    const alreadyLiked = await deckerboxd.checkDeckLike(deckId, userId);

    if (alreadyLiked) {
      // Se já curtiu, remove o like
      await deckerboxd.removeDeckLike(deckId, userId);
      return res.status(200).json({
        success: true,
        message: 'Deck unliked successfully.',
        data: null,
      });
    } else {
      // Se não curtiu, adiciona o like
      const likeId = `${deckId}-${userId}`; // Gera um ID único para o like
      await deckerboxd.addDeckLike(likeId, deckId, userId);
      return res.status(200).json({
        success: true,
        message: 'Deck liked successfully.',
        data: null,
      });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while toggling the like.',
      data: null,
    });
  }
});

router.get('/decks/:id/comments', async (req, res) => {
  const { id: deckId } = req.params;

  if (!deckId) {
    return res.status(400).json({
      success: false,
      message: 'Deck ID is required.',
      data: null,
    });
  }

  try {
    const comments = await deckerboxd.getDeckComments(deckId);

    return res.status(200).json({
      success: true,
      message: 'Comments retrieved successfully.',
      data: comments,
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching comments.',
      data: null,
    });
  }
});

router.post('/decks/:id/comment', async (req, res) => {
  const { id: deckId } = req.params;
  const { userId, content } = req.body;

  if (!userId || !content) {
    return res.status(400).json({
      success: false,
      message: 'User ID and comment content are required.',
      data: null,
    });
  }

  try {
    const commentId = `${deckId}-${userId}-${Date.now()}`;
    await deckerboxd.addDeckComment(commentId, deckId, userId, content);

    res.status(200).json({
      success: true,
      message: 'Comment added successfully.',
      data: null,
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while adding the comment.',
      data: null,
    });
  }
});

router.delete('/decks/:deckId/comment/:commentId', async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID is required.',
      data: null,
    });
  }

  try {
    const [comment] = await deckerboxd.getCommentById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found.',
        data: null,
      });
    }

    if (comment.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own comments.',
        data: null,
      });
    }

    await deckerboxd.deleteDeckComment(commentId);

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully.',
      data: null,
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the comment.',
      data: null,
    });
  }
});

router.get('/users/:userId/comments', async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID is required.',
      data: null,
    });
  }

  try {
    const likedDecks = await deckerboxd.getUserComments(userId);

    return res.status(200).json({
      success: true,
      message: 'User comments retrieved successfully.',
      data: likedDecks,
    });
  } catch (error) {
    console.error('Error fetching user comments:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching user comments.',
      data: null,
    });
  }
});

router.get('/users/:userId/likes', async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID is required.',
      data: null,
    });
  }

  try {
    const likedDecks = await deckerboxd.getUserLikedDecks(userId);

    return res.status(200).json({
      success: true,
      message: 'User likes retrieved successfully.',
      data: likedDecks,
    });
  } catch (error) {
    console.error('Error fetching user likes:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching user likes.',
      data: null,
    });
  }
});

// router.get('/insert', async (req, res) => {
//   try {
//     await deckerboxd.insertDecksFromDuels();

//     res.status(200).json({
//       success: true,
//       message: '165 decks inserted successfully.',
//       data: null,
//     });
//   } catch (error) {
//     console.error('Error inserting decks:', error);
//     res.status(500).json({
//       success: false,
//       message: 'An error occurred while inserting the decks.',
//       data: null,
//     });
//   }
// });

export default router;

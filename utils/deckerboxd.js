import db from './db.js';
import { decode } from '../utils/converter.js';

export const insertDecksFromDuels = async () => {
  const query = 'SELECT duelist1, deck1 FROM omega.duel ORDER BY start DESC LIMIT 255';
  const [duels] = await db.execute(query);

  for (const duel of duels) {
    const userId = duel.duelist1;

    // Verificar se o userId existe na tabela omega.user_discord_data
    const [userExists] = await db.execute('SELECT 1 FROM omega.user_discord_data WHERE discord_id = ?', [userId]);
    if (userExists.length === 0) {
      console.log(`User with discord_id ${userId} does not exist, skipping deck insertion.`);
      continue;
    }

    const deckCode = duel.deck1;
    const decodedDeck = decode(deckCode).passwords;
    if (!decodedDeck || decodedDeck.length < 4) continue;

    const coverCardId = decodedDeck[0];
    const mainCardIds = [decodedDeck[0], ...getRandomCards(decodedDeck)];

    const deckId = `${Date.now()}-${userId}`;
    console.log(`Inserting deck for user ${userId}`);

    await db.execute(
      'INSERT INTO website.decks (id, owner_id, name, cover_card_id, main_card_ids, tags, allow_comments, deck) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [deckId, userId, `Deck of ${userId}`, coverCardId, JSON.stringify(mainCardIds), JSON.stringify([]), true, deckCode]
    );
  }
};

const getRandomCards = (deck) => {
  const shuffled = [...deck].sort(() => Math.random() - 0.5);
  return shuffled.slice(1, 4);
};

export const getAllDecks = async () => {
  const query = `
    SELECT 
        d.id,
        d.name,
        d.deck,
        d.cover_card_id,
        d.main_card_ids,
        d.tags,
        d.allow_comments,
        (SELECT COUNT(*) FROM website.deck_likes WHERE deck_id = d.id) AS likes_count,
        (SELECT COUNT(*) FROM website.deck_comments WHERE deck_id = d.id AND d.allow_comments = TRUE) AS comments_count
    FROM website.decks d;
  `;
  const [rows] = await db.execute(query);
  return rows;
};

export const getPagedDecks = async (page = 1) => {
  const offset = (page - 1) * 16;

  const query = `
    SELECT
        d.id,
        d.name,
        d.deck,
        d.cover_card_id,
        d.main_card_ids,
        d.tags,
        d.allow_comments,
        (SELECT COUNT(*) FROM website.deck_likes WHERE deck_id = d.id) AS likes_count,
        (SELECT COUNT(*) FROM website.deck_comments WHERE deck_id = d.id AND d.allow_comments = TRUE) AS comments_count
    FROM website.decks d
    LIMIT 16 OFFSET ?;
  `;

  const countQuery = 'SELECT COUNT(*) AS total_decks FROM website.decks';

  const [decks] = await db.execute(query, [offset]);
  const [totalCount] = await db.execute(countQuery);

  const totalDecks = totalCount[0].total_decks;
  const totalPages = Math.ceil(totalDecks / 16);

  return { decks, totalPages };
};

export const getDeckById = async (deckId) => {
  const query = `
    SELECT 
        d.id,
        d.name,
        d.deck,
        d.cover_card_id,
        d.main_card_ids,
        d.tags,
        d.allow_comments,
        CAST(u.discord_id as CHAR) AS owner_id,
        u.username AS owner_username,
        u.avatar AS owner_avatar,
        u.displayname AS owner_displayname,
        (SELECT COUNT(*) FROM website.deck_likes WHERE deck_id = d.id) AS likes_count,
        (SELECT COUNT(*) FROM website.deck_comments WHERE deck_id = d.id AND d.allow_comments = TRUE) AS comments_count,
        (SELECT COUNT(*) FROM omega.duel o WHERE (o.duelist1 = d.owner_id AND o.deck1 = d.deck) OR (o.duelist2 = d.owner_id AND o.deck2 = d.deck)) AS duels_count,
        (SELECT COUNT(*) FROM omega.duel o WHERE (o.duelist1 = d.owner_id AND o.deck1 = d.deck AND o.result = 0) OR (o.duelist2 = d.owner_id AND o.deck2 = d.deck AND o.result = 1)) AS duels_wins
    FROM website.decks d
    JOIN omega.user_discord_data u ON d.owner_id = u.discord_id
    WHERE d.id = ?;
  `;
  const [rows] = await db.execute(query, [deckId]);
  return rows[0];
};

export const getDeckComments = async (deckId) => {
  const query = `
    SELECT 
        c.id,
        c.content,
        c.created_at,
        CAST(u.discord_id as CHAR) AS user_id,
        u.username AS user_username,
        u.avatar AS user_avatar,
        u.displayname AS user_displayname
    FROM website.deck_comments c
    JOIN omega.user_discord_data u ON c.user_id = u.discord_id
    WHERE c.deck_id = ?
    ORDER BY c.created_at DESC;
  `;
  const [rows] = await db.execute(query, [deckId]);
  return rows;
};

export const createDeck = async (id, ownerId, name, deck, coverCardId, mainCardIds, tags, allowComments) => {
  const query = `
    INSERT INTO website.decks (id, owner_id, name, deck, cover_card_id, main_card_ids, tags, allow_comments)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
  `;
  await db.execute(query, [
    id,
    ownerId,
    name,
    deck,
    coverCardId,
    JSON.stringify(mainCardIds),
    JSON.stringify(tags),
    allowComments,
  ]);
};

export const updateDeck = async (id, name, coverCardId, mainCardIds, tags, allowComments) => {
  const query = `
    UPDATE website.decks
    SET 
        name = ?,
        cover_card_id = ?,
        main_card_ids = ?,
        tags = ?,
        allow_comments = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?;
  `;
  await db.execute(query, [
    name,
    coverCardId,
    JSON.stringify(mainCardIds),
    JSON.stringify(tags),
    allowComments,
    id,
  ]);
};

export const deleteDeck = async (id) => {
  const query = `
    DELETE FROM website.decks
    WHERE id = ?;
  `;
  await db.execute(query, [id]);
};

export const addDeckLike = async (id, deckId, userId) => {
  const query = `
    INSERT INTO website.deck_likes (id, deck_id, user_id)
    VALUES (?, ?, ?);
  `;
  await db.execute(query, [id, deckId, userId]);
};

export const removeDeckLike = async (deckId, userId) => {
  const query = `
    DELETE FROM website.deck_likes
    WHERE deck_id = ? AND user_id = ?;
  `;
  await db.execute(query, [deckId, userId]);
};

export const addDeckComment = async (id, deckId, userId, content) => {
  const query = `
    INSERT INTO website.deck_comments (id, deck_id, user_id, content)
    VALUES (?, ?, ?, ?);
  `;
  await db.execute(query, [id, deckId, userId, content]);
};

export const updateDeckComment = async (id, content) => {
  const query = `
    UPDATE website.deck_comments
    SET content = ?, created_at = CURRENT_TIMESTAMP
    WHERE id = ?;
  `;
  await db.execute(query, [content, id]);
};

export const deleteDeckComment = async (id) => {
  const query = `
    DELETE FROM website.deck_comments
    WHERE id = ?;
  `;
  await db.execute(query, [id]);
};

export const checkDeckLike = async (deckId, userId) => {
  const query = `
    SELECT COUNT(*) AS already_liked
    FROM website.deck_likes
    WHERE deck_id = ? AND user_id = ?;
  `;
  const [rows] = await db.execute(query, [deckId, userId]);
  return rows[0].already_liked > 0;
};

export const getUserLikedDecks = async (userId) => {
  const query = `
    SELECT x.*, CAST (x.user_id as CHAR) as user_id FROM website.deck_likes x WHERE user_id= ?
  `;
  const [results] = await db.execute(query, [userId]);
  return results;
};

export const getUserComments = async (userId) => {
  const query = `
    SELECT x.*, CAST(x.user_id as CHAR) as user_id FROM website.deck_comments x WHERE user_id= ?
  `;
  const [results] = await db.execute(query, [userId]);
  return results;
};

export const getCommentById = async (commentId) => {
  const query = `
    SELECT x.*, CAST(x.user_id as CHAR) as user_id FROM website.deck_comments x WHERE id = ?
  `;
  const [results] = await db.execute(query, [commentId]);
  return results;
};
import db from './db.js';
import { decode } from './converter.js'
import { getDataOmega } from './setcodes.js'
import { getDeck } from './decks.js'

export const getAllTournament = async () => {
  const query = `
    SELECT t.id, t.starttime, t.extrarules, t.settings, t.banlist, t.players, t.endtime
    FROM omega.tournament t
    ORDER BY t.starttime DESC
  `;

  const [rows] = await db.execute(query);
  return rows
};

export const getTournament = async (id) => {
  const tournamentQuery = `
    SELECT t.id, t.starttime, t.extrarules, t.settings, t.banlist, t.players, t.endtime
    FROM omega.tournament t
    WHERE t.id = ${id}
    ORDER BY t.starttime DESC
  `;
  const [tournament] = (await db.execute(tournamentQuery))[0];

  const decksQuery = `
    SELECT CAST(u.user_id AS CHAR) AS id, u.deck, u.wins, u.loses, u.draws, u.rating
    FROM omega.tournament_user u
    WHERE u.tournament_id = ${id}
  `
  const [decks] = await db.execute(decksQuery);

  const roundsQuery = `
    SELECT id, phase, starttime, CAST(r.bye AS CHAR) AS bye
    FROM omega.tournament_round r
    WHERE r.tournament_id = ${id}
    ORDER BY r.id ASC
  `
  const [round] = await db.execute(roundsQuery);

  const roomsQuery = `
    SELECT d.round_id, d.room_id, CAST(d.duelist1 AS CHAR) AS duelist1, CAST(d.duelist2 AS CHAR) AS duelist2, d.end, d.result
    FROM omega.tournament_duel d
    WHERE d.round_id IN (${round.map(r => r.id).join(",")})
    ORDER BY d.round_id, d.room_id ASC
  `
  const [rooms] = await db.execute(roomsQuery);

  const playersQuery = `
    SELECT d.username, d.avatar, d.displayname, 
    id
      FROM (
          (SELECT CAST (duelist1 AS char) AS id
          FROM omega.tournament_duel
          WHERE round_id IN (${round.map(r => r.id).join(",")}))

          UNION

          (SELECT CAST (duelist2 AS char) AS id
          FROM omega.tournament_duel
          WHERE round_id IN (${round.map(r => r.id).join(",")}))
      ) AS combined_duelists
    LEFT JOIN user_discord_data d ON d.discord_id = id
    ORDER BY id;
  `

  const [players] = await db.execute(playersQuery);

  const rounds = round.map(round => ({
    ...round,
    rooms: rooms.filter(r => r.round_id === round.id),
  }))

  const deckData = await Promise.all(decks.map(async d => {
    const { passwords, mainSize, sideSize } = decode(d.deck)
    const { deck, data, passwords: sanitizedPasswords } = (await getDataOmega(passwords))
    const mainDeck = sanitizedPasswords.slice(0, mainSize)
    const sideDeck = sideSize ? sanitizedPasswords.slice(-sideSize) : []

    return {
      id: d.id,
      code: d.deck,
      passwords: {
        mainDeck,
        sideDeck,
      },
      set: await getDeck(d.deck)
    }
  }))

  const tableData = decks.map(({ id, wins, loses, draws, rating }) => ({ id, wins, loses, draws, rating }))
  console.log(decks)
  return { decks: deckData, players, tournament, rounds, table: tableData }
}
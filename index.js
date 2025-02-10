import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import decks from './routes/decks.js';
import rankedDecks from './routes/rankedDecks.js';
import duelist from './routes/duelist.js';
import leaderboard from './routes/leaderboard.js';
import lastLogins from './routes/lastLogins.js';
import deckdata from './routes/deckdata.js';
import tournaments from './routes/tournaments.js';
import convert from './routes/convert.js';
import profile from './routes/profile.js';

dotenv.config();

const app = express();
const port = 3000;
const allowedOrigins = ['http://localhost:5173', 'https://tournament.duelistsunite.org', 'https://omega.victorgodoka.com.br']; // URLs permitidas

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Permitir a requisição
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  }
}));

app.get('/', (req, res) => res.send('Working as intended (I wish).'))
app.use('/api/decks', decks)
app.use('/api/duelist', duelist)
app.use('/api/ranked-decks', rankedDecks)
app.use('/api/leaderboard', leaderboard)
app.use('/api/lastlogins', lastLogins)
app.use('/api/deckdata', deckdata)
app.use('/api/tournaments', tournaments)
app.use('/api/convert', convert)
app.use('/api/profile', profile)

app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

export const LASTBANLIST = '2024-12-09'

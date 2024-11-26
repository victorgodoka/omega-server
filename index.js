import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import decks from './routes/decks.js';
import duelist from './routes/duelist.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
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
app.use((err, req, res, next) => {
  console.log(process.env)
  console.error('Erro não tratado:', err);
  res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

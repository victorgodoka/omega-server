import fs from 'fs';
import path from 'path';
import express from 'express';
import axios from 'axios';
import { fileURLToPath } from 'url';

const router = express.Router();

const DB_URL = 'https://github.com/duelists-unite/omega-3/releases/download/data/omega.db';

// Criar __dirname manualmente para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Definir caminho de salvamento
const SAVE_PATH = path.join(__dirname, '../data/omega.db'); // Ajuste conforme necessário

router.get('/', async (req, res) => {
  try {
    // Garantir que a pasta existe
    if (!fs.existsSync(path.dirname(SAVE_PATH))) {
      fs.mkdirSync(path.dirname(SAVE_PATH), { recursive: true });
    }

    res.setHeader('Content-Type', 'text/plain');
    res.write('⏳ Baixando omega.db...\n');

    // Baixar o arquivo e salvar no caminho definido
    const response = await axios({
      method: 'get',
      url: DB_URL,
      responseType: 'stream',
    });

    const writer = fs.createWriteStream(SAVE_PATH);
    response.data.pipe(writer);

    writer.on('finish', () => {
      res.write('✅ Download concluído!\n');
      res.end();
    });

    writer.on('error', (err) => {
      res.write(`❌ Erro ao salvar arquivo: ${err.message}\n`);
      res.end();
    });

  } catch (error) {
    res.status(500).send(`❌ Erro: ${error.message}`);
  }
});

export default router
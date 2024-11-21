require('dotenv').config();
const express = require('express');
const multer = require('multer');

const {
  Upload,
} = require('@aws-sdk/lib-storage');

const {
  S3,
} = require('@aws-sdk/client-s3');

const cors = require('cors');
const sharp = require('sharp');
const decks = require('./routes/decks')

const app = express();
const port = process.env.PORT || 80;

const allowedOrigins = ['http://localhost:5173', 'https://tournament.duelistsunite.org/']; // URLs permitidas

// Middleware CORS com verificação dinâmica
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Permitir a requisição
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  }
}));

// Configuração do S3
const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },

  region: process.env.AWS_REGION,
});

// Configurando multer para armazenar arquivos em memória
const upload = multer({
  storage: multer.memoryStorage(), // Armazena arquivos em memória

  // Limita o tamanho do arquivo para 2MB (2 * 1024 * 1024 bytes)
  limits: { fileSize: 2 * 1024 * 1024 },

  // Filtro para validar tipos permitidos
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // Arquivo permitido
    } else {
      cb(new Error('Tipo de arquivo não permitido. Use PNG, JPG ou WebP.'));
    }
  },
});

app.get('/', (req, res) => res.send('Oiiii!'))
app.use('/decks', decks)

// Rota POST para upload da imagem
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado ou tipo não permitido.' });
    }

    // Converter a imagem para PNG
    const convertedImage = await sharp(file.buffer)
      .png() // Converte para PNG
      .toBuffer(); // Retorna um buffer

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `${file.originalname.split('.')[0]}.png`, // Novo nome do arquivo
      Body: convertedImage, // Usa a imagem convertida
      ContentType: 'image/png', // Define o tipo de conteúdo como PNG
    };

    // Enviando a imagem para o bucket S3
    const uploadResult = await new Upload({
      client: s3,
      params,
    }).done();

    res.json({
      message: 'Upload realizado com sucesso!',
      url: uploadResult.Location, // URL pública do arquivo no S3
    });
  } catch (error) {
    console.error('Erro ao fazer upload:', error);

    if (error.message.includes('File too large')) {
      return res.status(413).json({ error: 'Arquivo muito grande. O limite é de 2MB.' });
    }

    res.status(500).json({ error: 'Erro ao fazer upload do arquivo.' });
  }
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

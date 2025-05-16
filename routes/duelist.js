import express from 'express';
import multer from 'multer';
import mysql from 'mysql2/promise';
import cloudinary from '../utils/cloudinaryConfig.js';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 2 * 1024 * 1024 }, 
});

const db = await mysql.createPool({
  host: 'game.duelistsunite.org',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'website',
});

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('Erro do Multer:', err);
    return res.status(400).json({ success: false, message: 'Upload error.' });
  }
  next(err);
});

router.get('/', async (req, res) => {
  const { id } = req.query;
  try {
    if (!id) return res.status(200).json({ success: false, message: 'ID not found' });
    const [rows] = await db.query(`SELECT * from duelists WHERE id = ?`, [id]);

    if (!rows[0]) return res.status(200).json({ success: false, message: 'User not found' });
    return res.status(200).json({ data: { success: true, ...rows[0] } });
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return res.status(500).json({ success: false, mensagem: 'Servidor error.' });
  }
});

router.post('/', upload.single('duelistBanner'), async (req, res) => {
  try {
    const { id, duelistBio, duelistFavorite } = req.body;
    const file = req.file;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios.' });
    }

    let duelistBannerUrl = null;

    if (file) {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: 'duelist_banners',
        public_id: path.parse(file.originalname).name,
        transformation: {
          quality: 'auto',
          fetch_format: 'auto',
        },
      });

      duelistBannerUrl = uploadResult.secure_url;

      await fs.unlink(file.path);
    }

    await db.query(
      `INSERT INTO website.duelists (id, duelist_bio, duelist_favorite, duelist_banner_url)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         duelist_bio = VALUES(duelist_bio),
         duelist_favorite = VALUES(duelist_favorite)
         ${duelistBannerUrl ? `, duelist_banner_url = VALUES(duelist_banner_url)` : ''}`,
      [id, duelistBio, duelistFavorite || null, duelistBannerUrl || null]
    );

    res.status(201).json({
      data: { success: true, id, duelistBio, duelistBannerUrl },
    });
  } catch (error) {
    console.error('Erro ao processar o formulário:', error);
    res.status(500).json({ message: 'Erro ao salvar os dados.' });
  }
});

export default router;

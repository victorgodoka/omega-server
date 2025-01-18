import cron from 'node-cron';
import { migrateData } from './function.js';

cron.schedule('0 0 * * *', () => {
  console.log('Rodando migração de dados no cron...');
  migrateData();
});

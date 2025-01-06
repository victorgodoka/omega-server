import fs from 'fs'
import mysql from 'mysql2/promise'
import { Parser } from 'json2csv'
import db from './db.js';
import { client } from '../index.js';

async function exportarDados() {
  try {
    const [rows] = await db.execute(`SELECT * from omega.duel`);
    const parser = new Parser();
    const csv = parser.parse(rows);
    await client.set('dados_csv', csv); 
    console.log('Dados exportados para dados.csv');
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
  }
}

exportarDados();
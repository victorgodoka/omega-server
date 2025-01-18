import mysql from 'mysql2';
import dotenv from 'dotenv';
import { GraphQLClient } from 'graphql-request';
dotenv.config();

// URL da API GraphQL do Hasura
const hasuraUrl = 'http://localhost:8080/v1/graphql';

// Criação do cliente GraphQL
const graphQLClient = new GraphQLClient(hasuraUrl, {
  headers: {
    'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET, // Substitua com a chave secreta do Hasura
  },
});

// Conectar ao MySQL
const mysqlConnection = mysql.createConnection({
  host: 'game.duelistsunite.org',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  database: 'omega',
});

mysqlConnection.connect();

// Função para realizar a migração de dados
export const migrateData = async () => {
  console.log("Iniciando a migração de dados...");

  // Selecionar os dados do MySQL com a condição de data
  mysqlConnection.query('SELECT CAST(d.duelist1 AS CHAR) AS duelist1, CAST(d.duelist2 AS CHAR) AS duelist2, d.id, d.region, d.result, d.result1, d.result2, d.result3, d.reason1, d.reason2, d.reason3, d.deck1, d.deck2, d.start, d.end, d.first, d.usage FROM duel d WHERE d.start >= "2024-12-09"', async (err, results) => {
    if (err) {
      console.error('Erro ao buscar dados do MySQL:', err);
      return;
    }

    for (const row of results) {
      // Verificar se o dado já existe no PostgreSQL via GraphQL
      const checkQuery = `
        query checkDuel($id: bigint!) {
          duel_by_pk(id: $id) {
            id
          }
        }
      `;
      const checkVariables = { id: row.id };

      const checkResponse = await graphQLClient.request(checkQuery, checkVariables);

      if (checkResponse.duel_by_pk) {
        // Atualizar dados existentes no PostgreSQL via GraphQL
        const updateQuery = `
          mutation updateDuel(
            $id: bigint!,
            $duelist1: String!,
            $duelist2: String!,
            $region: smallint,
            $result: smallint,
            $result1: smallint,
            $result2: smallint,
            $result3: smallint,
            $reason1: smallint,
            $reason2: smallint,
            $reason3: smallint,
            $deck1: String,
            $deck2: String,
            $start: timestamptz,
            $end: timestamptz,
            $first: smallint,
            $usage: String
          ) {
            update_duel(
              where: { id: { _eq: $id } },
              _set: {
                duelist1: $duelist1,
                duelist2: $duelist2,
                region: $region,
                result: $result,
                result1: $result1,
                result2: $result2,
                result3: $result3,
                reason1: $reason1,
                reason2: $reason2,
                reason3: $reason3,
                deck1: $deck1,
                deck2: $deck2,
                start: $start,
                end: $end,
                first: $first,
                usage: $usage
              }
            ) {
              affected_rows
            }
          }
        `;
        const updateVariables = {
          id: row.id,
          duelist1: row.duelist1,
          duelist2: row.duelist2,
          region: row.region,
          result: row.result,
          result1: row.result1,
          result2: row.result2,
          result3: row.result3,
          reason1: row.reason1,
          reason2: row.reason2,
          reason3: row.reason3,
          deck1: row.deck1,
          deck2: row.deck2,
          start: row.start,
          end: row.end,
          first: row.first,
          usage: row.usage,
        };

        await graphQLClient.request(updateQuery, updateVariables);
        console.log(`Dado com id ${row.id} atualizado com sucesso!`);
      } else {
        // Inserir dados novos no PostgreSQL via GraphQL
        const insertQuery = `
          mutation insertDuel(
            $id: bigint!,
            $duelist1: String!,
            $duelist2: String!,
            $region: smallint,
            $result: smallint,
            $result1: smallint,
            $result2: smallint,
            $result3: smallint,
            $reason1: smallint,
            $reason2: smallint,
            $reason3: smallint,
            $deck1: String,
            $deck2: String,
            $start: timestamptz,
            $end: timestamptz,
            $first: smallint,
            $usage: String
          ) {
            insert_duel(objects: {
              id: $id,
              duelist1: $duelist1,
              duelist2: $duelist2,
              region: $region,
              result: $result,
              result1: $result1,
              result2: $result2,
              result3: $result3,
              reason1: $reason1,
              reason2: $reason2,
              reason3: $reason3,
              deck1: $deck1,
              deck2: $deck2,
              start: $start,
              end: $end,
              first: $first,
              usage: $usage
            }) {
              returning {
                id
              }
            }
          }
        `;
        const insertVariables = {
          id: row.id,
          duelist1: row.duelist1,
          duelist2: row.duelist2,
          region: row.region,
          result: row.result,
          result1: row.result1,
          result2: row.result2,
          result3: row.result3,
          reason1: row.reason1,
          reason2: row.reason2,
          reason3: row.reason3,
          deck1: row.deck1,
          deck2: row.deck2,
          start: row.start,
          end: row.end,
          first: row.first,
          usage: row.usage,
        };

        await graphQLClient.request(insertQuery, insertVariables);
        console.log(`Dado com id ${row.id} inserido com sucesso!`);
      }
    }
  });

  mysqlConnection.end();
};

import express from 'express';
import { Server } from 'http';
import { ServerConfig } from './infrastructure/config';
import { Postgres } from './infrastructure/postgres';

const sleep = (ms: number): Promise<void> =>
  new Promise((res) => setTimeout(res, ms));

export const start = async (): Promise<Server> =>
  new Promise(async (resolve, reject) => {
    try {
      const port = ServerConfig.port;
      if (!port) {
        throw new Error('No port defined');
      }
      const databaseConnection = Postgres.getConnection();
      await databaseConnection.authenticate();
      console.debug('Database connected');
      const app = express();
      app.get('/', (req, res) => {
        res.send('Hello World!');
      });

      const server = app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
        resolve(server);
      });
    } catch (err) {
      reject(err);
    }
  });

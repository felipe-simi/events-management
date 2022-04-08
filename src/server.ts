import express from 'express';
import { exitOnError } from './common/exitOnError';
import { BaseController } from './controller/BaseController';
import { ServerConfig } from './infrastructure/Config';

export class Server {
  private app: express.Application;
  private static server: Server;

  static getInstance(): Server {
    if (!this.server) {
      this.server = new Server();
    }
    return this.server;
  }

  private constructor() {
    this.app = express();
    this.initializeMiddlewares();
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
  }

  public listen(controllers: BaseController[]): void {
    controllers.forEach((controller: BaseController) => {
      this.app.use('/', controller.createRoutes());
    });
    const port = this.getPort();
    this.app.listen(port, () => {
      console.log(`App listening on the port ${port}`);
    });
  }

  private getPort(): number {
    const port = ServerConfig.port;
    if (port === undefined) {
      exitOnError(new Error('No port defined'));
    }
    return port!!;
  }
}

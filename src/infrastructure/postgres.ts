import { Sequelize, Transaction } from 'sequelize';
import { exitOnError } from '../common/exitOnError';
import { DatabaseConfig } from './Config';

export default class Postgres {
  private static connection: Sequelize;

  static getConnection(): Sequelize {
    if (!this.connection) {
      this.createConnection();
    }
    return this.connection;
  }

  static async createTransaction(): Promise<Transaction> {
    return this.connection.transaction();
  }

  private static createConnection() {
    this.connection = new Sequelize({
      dialect: 'postgres',
      database: DatabaseConfig.databaseName,
      host: DatabaseConfig.host,
      username: DatabaseConfig.username,
      password: DatabaseConfig.password,
      port: DatabaseConfig.port,
      logging: DatabaseConfig.logging,
      define: {
        timestamps: true,
      },
      pool: {
        acquire: DatabaseConfig.acquireTimeout,
        idle: DatabaseConfig.idleTimeout,
        min: DatabaseConfig.minPoolSize,
        max: DatabaseConfig.maxPoolSize,
      },
    });
    this.initializeDatabase();
  }

  private static async initializeDatabase() {
    const databaseConnection = Postgres.getConnection();
    try {
      await databaseConnection.authenticate();
      console.info('Database connected');
    } catch (error) {
      if (error instanceof Error) {
        exitOnError(error);
      } else {
        exitOnError(
          new Error('Unknown error type while connecting to Postgres')
        );
      }
    }
  }
}

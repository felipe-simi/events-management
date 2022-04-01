import { Sequelize } from 'sequelize';

import { DatabaseConfig } from './config';

export class Postgres {
  private static connection: Sequelize;

  static getConnection(): Sequelize {
    if (!this.connection) {
      this.createConnection();
    }
    return this.connection;
  }

  private static createConnection() {
    this.connection = new Sequelize({
      dialect: 'postgres',
      database: DatabaseConfig.databaseName,
      host: DatabaseConfig.host,
      username: DatabaseConfig.username,
      password: DatabaseConfig.password,
      port: DatabaseConfig.port,
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
  }
}

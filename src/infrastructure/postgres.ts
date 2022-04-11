import { Sequelize } from 'sequelize';
import { exitOnError } from '../common/exitOnError';
import { DatabaseConfig, ServerConfig } from './Config';

export default class Postgres {
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

  private static initializeDatabase() {
    const databaseConnection = Postgres.getConnection();
    if (ServerConfig.environment === 'local') {
      databaseConnection
        .sync({ force: true })
        .then(() => console.info('Database created'))
        .catch((err) => exitOnError(err));
    } else {
      databaseConnection
        .authenticate()
        .then(() => console.info('Database connected'))
        .catch((err) => exitOnError(err));
    }
  }
}

export class ServerConfig {
  static readonly environment = process.env.NODE_ENV
    ? process.env.NODE_ENV
    : '';
  static readonly port = process.env.PORT
    ? parseInt(process.env.PORT as string, 10)
    : undefined;
}

export class DatabaseConfig {
  static readonly databaseName = process.env.DB_NAME as string;
  static readonly host = process.env.DB_HOST as string;
  static readonly password = process.env.DB_PASS as string;
  static readonly port = parseInt(process.env.DB_PORT as string, 10);
  static readonly username = process.env.DB_USER as string;

  static readonly acquireTimeout = parseInt(
    process.env.DB_POOL_CONNECTION_TIMEOUT as string,
    10
  );
  static readonly idleTimeout = parseInt(
    process.env.DB_POOL_IDLE_TIMEOUT as string,
    10
  );
  static readonly maxPoolSize = parseInt(process.env.DB_POOL_MAX as string, 10);
  static readonly minPoolSize = parseInt(process.env.DB_POOL_MIN as string, 10);
}

import mysql, { PoolOptions, Pool } from 'mysql2/promise';

class MySQLService {
  private static instance: MySQLService;
  private pool: Pool;

  private constructor() {
    const access: PoolOptions = {
      user: 'root',
      password: '327TFg8qGjnrBi',
      database: 'omniwin',
      host: '127.0.0.1',
      port: 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    };

    this.pool = mysql.createPool(access);
  }

  public static getInstance(): MySQLService {
    if (!MySQLService.instance) {
      MySQLService.instance = new MySQLService();
    }
    return MySQLService.instance;
  }

  public getPool(): Pool {
    return this.pool;
  }
}

// Export the singleton instance directly
export default MySQLService.getInstance().getPool();

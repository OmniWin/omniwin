import mysql, { PoolOptions } from 'mysql2/promise';

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


const conn = mysql.createPool(access);

async function testConnection() {
    try {
      const pool = mysql.createPool({
        host: '127.0.0.1',
        user: 'root',
        password: '327TFg8qGjnrBi',
        database: 'omniwin'
      });
      const connection = await pool.getConnection();
      const [results] = await connection.execute('SELECT 1;');
      console.log(results);
      connection.release();
    } catch (err) {
      console.error('Database connection failed:', err);
    }
  }
  
  testConnection();

export default conn;
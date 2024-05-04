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

export default conn;
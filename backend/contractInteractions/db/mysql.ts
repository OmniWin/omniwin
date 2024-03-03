import mysql, { PoolOptions } from 'mysql2/promise'

const access: PoolOptions = {
    user: process.env.MYSQLDB_USER,
    password: process.env.MYSQLDB_PASSWORD,
    database: process.env.MYSQLDB_DATABASE,
    host: process.env.MYSQLDB_HOST,
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const conn = mysql.createPool(access);

export default conn;
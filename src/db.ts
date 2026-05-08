import mysql from "mysql2/promise";

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'bieutran1704',
    database: 'yolo_home_db'
});

export default db;
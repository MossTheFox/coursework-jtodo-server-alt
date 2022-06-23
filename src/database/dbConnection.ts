import mysql from 'mysql';
import * as dbQueries from './dbQueries';
import { debugLogger } from './debugger';

const mysqlConnection = mysql.createConnection({
    port: process.env.MYSQL_PORT,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    flags: '--protocol=TCP -MultiStatements'
});

// alt: use connection url:
// const connectionString = "mysql://"
//     + process.env.MYSQL_USER
//     + ":" + process.env.MYSQL_PASSWORD
//     + "@" + process.env.MYSQL_HOST_DEVELOPMENT
//     + ":" + process.env.MYSQL_PORT_DEVELOPMENT
//     + "/" + process.env.MYSQL_DATABASE
//     + "?charset=utf8&protocol=TCP";


mysqlConnection.connect((err) => {
    if (err) {
        console.error(`[${new Date().toLocaleString()}] [dbConnection] [error] ${err.message}`);
        return;
    }
    console.log(`[${new Date().toLocaleString()}] [dbConnection] [info] Connected to the database.`);
});


// do some test here


// DEBUG ONLY
mysqlConnection.query("SHOW TABLES", (err, results) => {
    if (err) {
        console.error(`[${new Date().toLocaleString()}] [dbConnection] [error] ${err.message}`);
        return;
    }
    debugLogger(results, "dbConnection - SHOW TABLES");
});

// INITIALIZE DATABASE
mysqlConnection.query(dbQueries.createUserTableIfNotExistsQuery, (err, results) => {
    if (err) {
        console.error(`[${new Date().toLocaleString()}] [dbConnection] [error] ${err.message}`);
        process.exit(1);
    }
    debugLogger(results, "dbConnection - createUserTableIfNotExistsQuery");
});

mysqlConnection.query(dbQueries.createTodoCollectionTableIfNotExistsQuery, (err, results) => {
    if (err) {
        console.error(`[${new Date().toLocaleString()}] [dbConnection] [error] ${err.message}`);
        process.exit(1);
    }
    debugLogger(results, "dbConnection - createTodoCollectionTableIfNotExistsQuery");
});

mysqlConnection.query(dbQueries.createTodoItemTableIfNotExistsQuery, (err, results) => {
    if (err) {
        console.error(`[${new Date().toLocaleString()}] [dbConnection] [error] ${err.message}`);
        process.exit(1);
    }
    debugLogger(results, "dbConnection - createTodoItemTableIfNotExistsQuery");
});


export default mysqlConnection;
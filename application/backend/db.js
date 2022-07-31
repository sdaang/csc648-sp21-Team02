 const mysql = require('mysql2');

const connection = mysql.createPool({
    connectionLimit: 100,
    host:'csc648project-database.ceh0a99r5rym.us-west-2.rds.amazonaws.com',
    user:'admin',
    password:'7Fb!Ve35',
    database: 'M4'
});

module.exports = connection


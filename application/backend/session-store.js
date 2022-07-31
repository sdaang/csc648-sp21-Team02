const session = require('express-session');
let MySQLStore = require('express-mysql-session')(session);

const connection = require('./db');

var options = {
    host:'csc648project-database.ceh0a99r5rym.us-west-2.rds.amazonaws.com',
    user:'admin',
    password:'7Fb!Ve35',
    database: 'M4'
};

var sessionStore = new MySQLStore(options);

module.exports = sessionStore

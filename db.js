const initOptions = {
    error: function (err, e) {  
        console.log(err);
    }
};


var pgp = require("pg-promise")(initOptions);

// For Debugging
const monitor = require('pg-monitor');
const sql = require('./sql/sql.js');


// Database connection details;
const cn = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
}
console.log(process.env.DB_HOST);
const db = pgp(cn);

//monitor.attach(initOptions);

db.none(sql.init);

module.exports = db;
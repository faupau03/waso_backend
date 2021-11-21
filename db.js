var pgp = require("pg-promise")(/*options*/);


const cn = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
}
console.log(process.env.DB_HOST);
const db = pgp(cn);

module.exports = db;
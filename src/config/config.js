require('dotenv').config();

const config = {
    port: process.env.PORT || 4000,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME
}

module.exports = { config };
const { parsed: env } = require('dotenv').config()

module.exports = {
   dialect: 'mssql',
   host: env.DATABASE_HOST,
   port: env.DATABASE_PORT,
   username: env.DATABASE_USERNAME,
   password: env.DATABASE_PASSWORD,
   database: env.DATABASE_NAME,
}
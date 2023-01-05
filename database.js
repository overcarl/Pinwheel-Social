const postgres = require('postgres')

const sql = postgres(process.env.sql)

module.exports = sql;
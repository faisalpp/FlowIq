const postgres = require('postgres')
const {SHOPIFY} = require('../config');

const connectionString = SHOPIFY.DATABASE_URL;
const sql = postgres(connectionString)

module.exports = sql
// 3sG5CWEUxKoLB3ZA
require('dotenv').config();

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  BASE_URL: process.env.BASE_URL,
  SHOPIFY: {
    API_KEY: process.env.SHOPIFY_PUBLIC_KEY,
    API_SECRET: process.env.SHOPIFY_PRIVATE_KEY,
    SHOPIFY_SCOPES: process.env.SHOPIFY_SCOPES,
    SHOPIFY_CALLBACK_URL: process.env.SHOPIFY_CALLBACK_URL,
    DATABASE_URL: process.env.DATABASE_URL
  }
}
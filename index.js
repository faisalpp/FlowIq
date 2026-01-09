// const cors = require('cors');
const express = require('express');
const path = require('path');
const routes = require('./apis');
const { SHOPIFY } = require('./config');
const { RedirectToShopifyAuth, HandleCallback } = require('./controllers/shopifyController');

const app = express();
const PORT = 3000;

/* -------------------- Middleware -------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(cors({
//   origin: [
//     'https://oreemapp.myshopify.com',
//     'https://www.dtf-world.de'
//   ],
//   credentials: true
// }));

/* -------------------- Static Files -------------------- */
app.use(
  '/dashboard',
  express.static(path.join(__dirname, 'public'), {
    extensions: ['html']
  })
);

/* -------------------- Routes -------------------- */

// Dynamic config
app.get('/config.js', (req, res) => {
  res.type('application/javascript');
  res.send(`
    window.APP_CONFIG = {
      SHOPIFY_API_KEY: "${SHOPIFY.publicKey}"
    };
  `);
});

// Shopify auth
app.get('/', RedirectToShopifyAuth);
app.get('/callback', HandleCallback);

// API routes
app.use('/api', routes);

/* -------------------- Server -------------------- */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

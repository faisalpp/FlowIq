const sql = require('../../db');

async function upsertShopAuth(shop, access_token) {
  // 1️⃣ Check if shop exists
  const rows = await sql`
    SELECT * FROM flow_iq_auth WHERE shop = ${shop} LIMIT 1
  `;

  const existingAuth = rows[0];

  if (existingAuth) {
    // 2️⃣ Update token
    await sql`
      UPDATE flow_iq_auth
      SET token = ${access_token}
      WHERE id = ${existingAuth.id}
    `;
  } else {
    // 3️⃣ Insert new row
    await sql`
      INSERT INTO flow_iq_auth (shop, token)
      VALUES (${shop}, ${access_token})
    `;
  }

  return existingAuth || null;
}

module.exports = { upsertShopAuth };
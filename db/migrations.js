const sql = require('./index'); // your postgres client

async function runMigrations() {
  await sql`
    CREATE TABLE IF NOT EXISTS flow_iq_auth (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      shop TEXT UNIQUE NOT NULL,
      token TEXT,
      created_at TIMESTAMP DEFAULT now()
    )
  `;
  console.log('Migration complete');
  process.exit(0); // exit after running
}

runMigrations().catch(err => {
  console.error(err);
  process.exit(1);
});

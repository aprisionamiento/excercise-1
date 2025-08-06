import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({
  connectionString: "postgresql://root:bsOYMBGsVIDZev3p3e61lS9prvzg545Z@dpg-d28dqfvdiees73djr8r0-a.oregon-postgres.render.com/cff",
  ssl: {
    rejectUnauthorized: false
  },
});

export default pool;

async function testConnection() {

try {
  const client = await pool.connect();
  console.log("Connected to the database successfully");
  client.release();
} catch (error) {
  console.error("Error connecting to the database:", error);
}
}

testConnection();
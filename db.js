import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({
  connectionString: "postgresql://root:kGNP73JSoGm7xfIBRHD3FjwJILHP45GW@dpg-d0vkl4ruibrs73eb0pp0-a.oregon-postgres.render.com/balatro",
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
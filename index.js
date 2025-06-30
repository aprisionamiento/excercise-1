import pool from './db.js';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/create-data-table', async (_, res) => {
  try {
    const tableName = 'data';

    const checkTable = await pool.query(
      'SELECT to_regclass($1) AS exists',
      [tableName]
    );

    if (!checkTable.rows[0].exists) {
      await pool.query(`
        CREATE TABLE ${tableName} (
          matricula SERIAL PRIMARY KEY,
          value TEXT NOT NULL,
          nombre TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      return res.status(201).json({ message: 'Tabla creada exitosamente' });
    } else {
      return res.status(200).json({ message: 'La tabla ya existe' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});

app.post("/savedata", async (req, res) => {
  const { nombre, value, matricula } = req.body;

  if (!nombre || !value || !matricula) {
    return res.status(400).json({ error: "Los campos 'nombre', 'value' y 'matricula' son requeridos" });
  }

  try {
    const result = await pool.query(
      'INSERT INTO data (nombre, value, matricula) VALUES ($1, $2, $3) RETURNING *',
      [nombre, value, matricula]
    );

    return res
      .status(201)
      .json({
        message: "✅ Datos guardados exitosamente",
        data: result.rows[0],
      });
      
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: "Error al guardar los datos" });
  }
});


app.post("/deletedata", async (_, res) => {
  const tableName = "data";
  try {
    await pool.query(`DROP TABLE IF EXISTS ${tableName}`);
    return res.status(200).json({ message: "Tabla eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la tabla" });
  }
});

app.get("/temperature", (_, res) => {
    res.json({ valor: "10 ºC", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
const express = require('express');
const cors = require('cors');
const snmp = require('net-snmp');
const { Pool } = require('pg');

const app = express();
const PORT = 3001;
app.use(cors());
app.use(express.json());

app.post('/api/impresoras', async (req, res) => {
  const { ip, sucursal, modelo, drivers_url, tipo } = req.body;
  try {
    await pool.query(
      'INSERT INTO impresoras (ip, sucursal, modelo, drivers_url, tipo) VALUES ($1, $2, $3, $4, $5)',
      [ip, sucursal, modelo, drivers_url, tipo]
    );
    res.status(201).json({ message: 'Impresora agregada' });
  } catch (err) {
    console.error('Error al agregar impresora:', err);
    res.status(500).json({ error: 'Error al insertar impresora' });
  }
});
// Configuración de conexión a PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Impresoras',
  password: '123',
  port: 5432,
});

// OID para tóner negro
const OID_TONER_NEGRO = '1.3.6.1.2.1.43.11.1.1.9.1.1';

function consultarToner(ip) {
  return new Promise((resolve) => {
    const session = snmp.createSession(ip, "public", { timeout: 2000 });

    session.get([OID_TONER_NEGRO], (error, varbinds) => {
      if (error || !varbinds || varbinds[0].type === snmp.ObjectType.NoSuchInstance) {
        resolve({ toner: null, error: true });
      } else {
        const value = varbinds[0].value;
        resolve({ toner: value, error: false });
      }
      session.close();
    });
  });
}

app.get('/api/toners', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM impresoras ORDER BY id');
    const impresoras = result.rows;

    const impresorasConToner = await Promise.all(
      impresoras.map(async (impresora) => {
        const resultado = await consultarToner(impresora.ip);
        return {
          ...impresora,
          toner: resultado.toner,
          error: resultado.error,
        };
      })
    );
app.delete('/api/impresoras/', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM impresoras WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Impresora no encontrada' });
    }

    res.json({ mensaje: 'Impresora eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar impresora:', error);
    res.status(500).json({ error: 'Error al eliminar impresora' });
  }
});

    res.json({ impresoras: impresorasConToner });
  } catch (error) {
    console.error('Error consultando la base de datos:', error);
    res.status(500).json({ error: 'Error consultando base de datos' });
  }
});

app.listen(PORT, () => {
  console.log('Servidor SNMP activo en http://localhost:${PORT} ✅');
});

const express = require('express');
const cors = require('cors');
const snmp = require('net-snmp');
const { Pool } = require('pg');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Configuración de conexión a PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Impresoras',
  password: '123',
  port: 5432,
});

// OIDs SNMP comunes para impresoras
const OID_TONER_NEGRO = '1.3.6.1.2.1.43.11.1.1.9.1.1'; // Tóner negro
const OID_NUMERO_SERIE = '1.3.6.1.2.1.43.5.1.1.17.1';   // Número de serie
const OID_CONTADOR_IMPRESIONES = '1.3.6.1.2.1.43.10.2.1.4.1.1'; // Contador de páginas

// Función para consultar información de la impresora vía SNMP
function consultarInformacionImpresora(ip) {
  return new Promise((resolve) => {
    const session = snmp.createSession(ip, "public", { timeout: 2000 });
    const oids = [OID_TONER_NEGRO, OID_NUMERO_SERIE, OID_CONTADOR_IMPRESIONES];

    session.get(oids, (error, varbinds) => {
      if (error || !varbinds) {
        resolve({ toner: null, contador: null, numero_serie: null, error: true });
      } else {
        const toner = varbinds[0]?.value ?? null;
        const numero_serie = varbinds[1]?.value?.toString() ?? null;
        const contador = varbinds[2]?.value ?? null;

        resolve({
          toner,
          numero_serie,
          contador,
          error: false,
        });
      }
      session.close();
    });
  });
}

// Endpoint para agregar impresora
app.post('/api/impresoras', async (req, res) => {
  const { ip, sucursal, modelo, drivers_url, tipo, toner_reserva } = req.body;
  try {
    await pool.query(
      'INSERT INTO impresoras (ip, sucursal, modelo, drivers_url, tipo, toner_reserva) VALUES ($1, $2, $3, $4, $5, $6)',
      [ip, sucursal, modelo, drivers_url, tipo, toner_reserva]
    );
    res.status(201).json({ message: 'Impresora agregada' });
  } catch (err) {
    console.error('Error al agregar impresora:', err);
    res.status(500).json({ error: 'Error al insertar impresora' });
  }
});

// Verificación automática del nivel de tóner cada 5 minutos
setInterval(async () => {
  try {
    const { rows: impresoras } = await pool.query('SELECT * FROM impresoras');

    for (const impresora of impresoras) {
      const resultado = await consultarInformacionImpresora(impresora.ip);

      if (!resultado.error && resultado.toner !== null) {
        const tonerActual = resultado.toner;
        const tonerAnterior = impresora.toner_anterior;

        // Detecta si se repuso el tóner
        if (tonerAnterior !== null && tonerActual > tonerAnterior) {
          await pool.query(
            `UPDATE impresoras
             SET cambios_toner = cambios_toner + 1,
                 fecha_ultimo_cambio = NOW(),
                 toner_anterior = $1,
                 toner_reserva = GREATEST(toner_reserva - 1, 0)
             WHERE id = $2`,
            [tonerActual, impresora.id]
          );
          console.log(`🟢 Cambio de tóner detectado en IP ${impresora.ip}`);
        } else {
          // Solo actualiza el nivel actual
          await pool.query(
            `UPDATE impresoras
             SET toner_anterior = $1
             WHERE id = $2`,
            [tonerActual, impresora.id]
          );
        }
      }
    }
  } catch (error) {
    console.error('Error en la verificación automática de tóner:', error);
  }
}, 300000); // 5 minutos

// Endpoint para obtener impresoras con tóner, número de serie y contador
app.get('/api/toners', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM impresoras ORDER BY id');
    const impresoras = result.rows;

    const impresorasConToner = await Promise.all(
      impresoras.map(async (impresora) => {
        const resultado = await consultarInformacionImpresora(impresora.ip);

        return {
          ...impresora,
          toner: resultado.toner,
          error: resultado.error,
          info: {
            numero_serie: resultado.numero_serie,
            contador: resultado.contador,
          }
        };
      })
    );

    res.json({ impresoras: impresorasConToner });
  } catch (error) {
    console.error('Error consultando la base de datos:', error);
    res.status(500).json({ error: 'Error consultando base de datos' });
  }
});

// Endpoint para eliminar impresora
app.delete('/api/impresoras/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM impresoras WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Impresora no encontrada' });
    }

    res.json({ mensaje: 'Impresora eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar impresora:', error);
    res.status(500).json({ error: 'Error al eliminar impresora' });
  }
});

// Endpoint para editar impresora
app.put('/api/impresoras/:id', async (req, res) => {
  const { id } = req.params;
  const { ip, sucursal, modelo, drivers_url, tipo, toner_reserva } = req.body;

  try {
    const result = await pool.query(
      `UPDATE impresoras 
       SET ip = $1, sucursal = $2, modelo = $3, drivers_url = $4, tipo = $5, toner_reserva = $6 
       WHERE id = $7 RETURNING *`,
      [ip, sucursal, modelo, drivers_url, tipo, toner_reserva, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Impresora no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al editar impresora:', error);
    res.status(500).json({ error: 'Error al editar impresora' });
  }
});

// Servidor escuchando
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor SNMP activo en http://localhost:${PORT} ✅`);
});

// Datos predefinidos
const PREDEFINIDOS = {
  nombre: 'Bryan Medina',
  direccion: 'RUTA ACCESO A SANTANI - 200 METROS DE LA ROTONDA -SANTANI',
  telefono: '0987 200316',
  correo: 'bryan.medina@surcomercial.com.py',
};

// Endpoint para generar y guardar pedido
app.post('/api/pedidos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query('SELECT * FROM impresoras WHERE id = $1', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Impresora no encontrada' });
    }

    const impresora = rows[0];

    // Consultamos el número de serie y contador actual vía SNMP
    const resultado = await consultarInformacionImpresora(impresora.ip);

    const nuevoPedido = {
      impresora_id: impresora.id,
      modelo: impresora.modelo,
      numero_serie: resultado.numero_serie || 'N/A',
      contador_total: resultado.contador || 0,
      nombre: PREDEFINIDOS.nombre,
      direccion: PREDEFINIDOS.direccion,
      telefono: PREDEFINIDOS.telefono,
      correo: PREDEFINIDOS.correo,
    };

    // Insertamos en la base de datos
    await pool.query(
      `INSERT INTO pedidos (impresora_id, modelo, numero_serie, contador_total, nombre, direccion, telefono, correo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        nuevoPedido.impresora_id,
        nuevoPedido.modelo,
        nuevoPedido.numero_serie,
        nuevoPedido.contador_total,
        nuevoPedido.nombre,
        nuevoPedido.direccion,
        nuevoPedido.telefono,
        nuevoPedido.correo,
      ]
    );

    // Devolvemos el contenido para "copiar y pegar"
    const texto = `🖨 Pedido generado:\n\nModelo: ${nuevoPedido.modelo}\nSerie: ${nuevoPedido.numero_serie}\nContador total al día: ${nuevoPedido.contador_total}\nNombre y Apellido: ${nuevoPedido.nombre}\nDirección de entrega: ${nuevoPedido.direccion}\nNúmero de contacto: ${nuevoPedido.telefono}\nCorreo electrónico: ${nuevoPedido.correo}`;

    res.json({ mensaje: 'Pedido guardado', texto });
  } catch (error) {
    console.error('Error al generar pedido:', error);
    res.status(500).json({ error: 'Error al generar el pedido' });
  }
});

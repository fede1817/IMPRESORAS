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
    const session = snmp.createSession(ip, "public", { timeout: 5000 });
    const oids = [OID_TONER_NEGRO, OID_NUMERO_SERIE, OID_CONTADOR_IMPRESIONES];

    session.get(oids, (error, varbinds) => {
      if (error || !varbinds) {
        console.log(`Error SNMP para IP ${ip}:`, error?.message || 'No se recibieron varbinds');
        resolve({ toner: null, contador: null, numero_serie: null, error: true });
      } else {
        const toner = varbinds[0]?.value ?? null;
        const numero_serie = varbinds[1]?.value?.toString() ?? null;
        const contador = varbinds[2]?.value ?? null;

        console.log(`SNMP para IP ${ip}: toner=${toner}, numero_serie=${numero_serie}, contador=${contador}`);
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
  const { ip, sucursal, modelo, drivers_url, tipo, toner_reserva, direccion } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO impresoras (ip, sucursal, modelo, drivers_url, tipo, toner_reserva, direccion) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [ip, sucursal, modelo, drivers_url, tipo, toner_reserva, direccion]
    );
    const impresoraId = result.rows[0].id;

    const resultado = await consultarInformacionImpresora(ip);
    if (!resultado.error) {
      await pool.query(
        'UPDATE impresoras SET numero_serie = $1, contador_paginas = $2, toner_anterior = $3 WHERE id = $4',
        [resultado.numero_serie, resultado.contador, resultado.toner, impresoraId]
      );
      console.log(`Impresora agregada IP ${ip}: numero_serie=${resultado.numero_serie}, contador_paginas=${resultado.contador}`);
    } else {
      console.log(`Error SNMP al agregar impresora IP ${ip}`);
    }

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

      if (!resultado.error) {
        const tonerActual = resultado.toner;
        const tonerAnterior = impresora.toner_anterior;
        const numeroSerie = resultado.numero_serie;
        const contador = resultado.contador;

        try {
          if (tonerAnterior !== null && tonerActual > tonerAnterior && tonerActual >= 90 && tonerAnterior < 20) {
            await pool.query(
              `UPDATE impresoras
               SET cambios_toner = cambios_toner + 1,
                   fecha_ultimo_cambio = NOW(),
                   toner_anterior = $1,
                   toner_reserva = GREATEST(toner_reserva - 1, 0),
                   numero_serie = $2,
                   contador_paginas = $3
               WHERE id = $4`,
              [tonerActual, numeroSerie, contador, impresora.id]
            );
            console.log(`🟢 Cambio de tóner detectado en IP ${impresora.ip}`);
          } else {
            await pool.query(
              `UPDATE impresoras
               SET toner_anterior = $1,
                   numero_serie = $2,
                   contador_paginas = $3
               WHERE id = $4`,
              [tonerActual, numeroSerie, contador, impresora.id]
            );
          }
          console.log(`Actualización exitosa para IP ${impresora.ip}: numero_serie=${numeroSerie}, contador_paginas=${contador}`);
        } catch (updateError) {
          console.error(`Error al actualizar base de datos para IP ${impresora.ip}:`, updateError.message);
        }
      } else {
        console.log(`Error SNMP para IP ${impresora.ip}`);
      }
    }
  } catch (error) {
    console.error('Error en la verificación automática de tóner:', error);
  }
}, 300000);

// Endpoint para obtener impresoras con tóner, número de serie y contador
app.get('/api/toners', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM impresoras ORDER BY id');
    const impresoras = result.rows;

    const impresorasConToner = await Promise.all(
      impresoras.map(async (impresora) => {
        const resultado = await consultarInformacionImpresora(impresora.ip);

        if (!resultado.error) {
          try {
            await pool.query(
              'UPDATE impresoras SET numero_serie = $1, contador_paginas = $2 WHERE id = $3',
              [resultado.numero_serie, resultado.contador, impresora.id]
            );
            console.log(`Actualización exitosa para IP ${impresora.ip}: numero_serie=${resultado.numero_serie}, contador_paginas=${resultado.contador}`);
          } catch (updateError) {
            console.error(`Error al actualizar base de datos para IP ${impresora.ip}:`, updateError.message);
          }
        }

        return {
          ...impresora,
          toner: resultado.toner,
          error: resultado.error,
          numero_serie: resultado.numero_serie || impresora.numero_serie,
          contador_paginas: resultado.contador || impresora.contador_paginas
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
  const { ip, sucursal, modelo, drivers_url, tipo, toner_reserva, direccion } = req.body;

  try {
    const result = await pool.query(
      `UPDATE impresoras 
       SET ip = $1, sucursal = $2, modelo = $3, drivers_url = $4, tipo = $5, toner_reserva = $6, direccion = $7
       WHERE id = $8 RETURNING *`,
      [ip, sucursal, modelo, drivers_url, tipo, toner_reserva, direccion, id]
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

// Endpoint para crear un nuevo pedido
app.post('/api/pedidos', async (req, res) => {
  const { impresora_id, modelo, numero_serie, contador_total, nombre, direccion, telefono, correo } = req.body;
  try {
    const result = await pool.query(
      `UPDATE impresoras 
       SET modelo = $1, 
           sucursal = $2, 
           direccion = $3, 
           telefono = $4, 
           correo = $5, 
           ultimo_pedido_contador = $6, 
           ultimo_pedido_fecha = NOW(),
           numero_serie = $7, 
           contador_paginas = $8,
           toner_reserva = toner_reserva + 1
       WHERE id = $9 RETURNING *`,
      [modelo, nombre, direccion, telefono, correo, contador_total, numero_serie, contador_total, impresora_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Impresora no encontrada' });
    }
    res.status(201).json({ message: 'Pedido registrado correctamente ✅' });
  } catch (error) {
    console.error('Error al registrar pedido:', error.message, error.stack);
    res.status(500).json({ error: `Error al registrar pedido: ${error.message}` });
  }
});

// Servidor escuchando
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor SNMP activo en http://localhost:${PORT} ✅`);
});
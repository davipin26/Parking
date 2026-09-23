const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

// El vigilante de seguridad traído desde su propia capa (adiós código espagueti 🍝)
const { verificarSeguridad } = require('./middlewares/seguridad');

const app = express();

// Habilitar CORS y recepción de JSON
app.use(cors());
app.use(express.json());

// 1. Conexión a la base de datos SQLite (haciendo su magia)
const db = new sqlite3.Database('./parqueadero_api.sqlite', (err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite (Backend API).');
    
    // Para crear la señora tabla de usuarios si no existe
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      correo TEXT UNIQUE NOT NULL,
      clave TEXT NOT NULL
    )`);
    
    // Crear la tabla para los vehículos sincronizados
    db.run(`CREATE TABLE IF NOT EXISTS vehiculos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      placa TEXT NOT NULL,
      tipo_vehiculo TEXT NOT NULL,
      hora_ingreso TEXT NOT NULL,
      estado TEXT DEFAULT 'Adentro'
    )`);
  }
});

// Una rutita de prueba
app.get('/', (req, res) => {
  res.send('API del Parqueadero funcionando correctamente');
});

// 2. La señora ruta para Registrar Usuario
app.post('/api/registro', (req, res) => {
  const { nombre, correo, clave } = req.body;
  
  if (!nombre || !correo || !clave) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  const query = `INSERT INTO usuarios (nombre, correo, clave) VALUES (?, ?, ?)`;
  db.run(query, [nombre, correo, clave], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ mensaje: 'El correo ya está registrado' });
      }
      return res.status(500).json({ mensaje: 'Error al registrar usuario' });
    }
    res.status(201).json({ mensaje: 'Usuario registrado exitosamente', id: this.lastID });
  });
});

// 3. Y la señora ruta para Iniciar Sesión
app.post('/api/login', (req, res) => {
  const { correo, clave } = req.body;

  if (!correo || !clave) {
    return res.status(400).json({ mensaje: 'Correo y clave son obligatorios' });
  }

  const query = `SELECT * FROM usuarios WHERE correo = ? AND clave = ?`;
  db.get(query, [correo, clave], (err, row) => {
    if (err) {
      return res.status(500).json({ mensaje: 'Error en el servidor' });
    }
    if (row) {
      res.status(200).json({ mensaje: 'Login exitoso', usuario: { id: row.id, nombre: row.nombre } });
    } else {
      res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }
  });
});

// 4. Ruta para Sincronizar Datos Offline (gritos de nutria locaa 🦦) - ¡Protegida!
app.post('/api/sincronizar', verificarSeguridad, (req, res) => {
  const { registros } = req.body; // Un array con los carros guardados en el celular
  
  if (!registros || registros.length === 0) {
    return res.status(400).json({ mensaje: 'No hay datos para sincronizar' });
  }

  // Preparamos una sola consulta para insertar todos
  const placeholders = registros.map(() => '(?, ?, ?)').join(',');
  const valores = [];
  registros.forEach(reg => {
    valores.push(reg.placa, reg.tipo_vehiculo, reg.hora_ingreso);
  });

  const query = `INSERT INTO vehiculos (placa, tipo_vehiculo, hora_ingreso) VALUES ${placeholders}`;
  
  db.run(query, valores, function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ mensaje: 'Error al sincronizar en la base de datos de la nube' });
    }
    res.status(200).json({ mensaje: 'Sincronización exitosa', insertados: this.changes });
  });
}); // <- Aquí ya cerró correctamente la nutria loca

// 5. La poderosísima ruta para Obtener los Vehículos Adentro - ¡Protegida!
app.get('/api/vehiculos', verificarSeguridad, (req, res) => {
  const query = `SELECT * FROM vehiculos WHERE estado = 'Adentro' ORDER BY id DESC`;
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ mensaje: 'Error al consultar vehículos' });
    }
    res.status(200).json(rows);
  });
});

// 6. Ruta para Dar Salida a un Vehículo (chao, que te vi 👋) - ¡Protegida!
app.put('/api/salida/:id', verificarSeguridad, (req, res) => {
  const id = req.params.id;
  const query = `UPDATE vehiculos SET estado = 'Salió' WHERE id = ?`;
  
  db.run(query, [id], function(err) {
    if (err) {
      return res.status(500).json({ mensaje: 'Error al registrar salida' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
    }
    res.status(200).json({ mensaje: 'Salida registrada correctamente' });
  });
});

// Configuración del puerto para Render (que empiece el show)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor API corriendo en el puerto ${PORT}`);
});
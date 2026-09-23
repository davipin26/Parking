const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Crea el archivo de base de datos en esta misma carpeta
const dbPath = path.resolve(__dirname, 'parqueadero_api.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con SQLite:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite (Backend API).');
  }
});

// Crear las tablas si no existen
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    correo TEXT UNIQUE NOT NULL,
    clave TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS ingresos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    placa TEXT NOT NULL,
    tipo_vehiculo TEXT NOT NULL,
    hora_ingreso TEXT NOT NULL,
    hora_salida TEXT,
    estado TEXT DEFAULT 'Activo'
  )`);
});

module.exports = db;
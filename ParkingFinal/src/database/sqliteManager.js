import * as SQLite from 'expo-sqlite';

// Crea o abre la base de datos local en el celular
const dbPromise = SQLite.openDatabaseAsync('parqueadero_offline.db');

export const prepararBaseDeDatos = async () => {
  try {
    const db = await dbPromise;
    
    // Tabla para guardar los carros cuando no hay internet
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS ingresos_offline (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        placa TEXT NOT NULL,
        tipo_vehiculo TEXT NOT NULL,
        hora_ingreso TEXT NOT NULL,
        sincronizado INTEGER DEFAULT 0
      );
    `);
    
    console.log("Base de datos offline lista en el celular.");
  } catch (error) {
    console.error("Error creando tablas locales:", error);
  }
};

// Función para guardar un carro localmente si se cae el internet
export const guardarIngresoLocal = async (placa, tipoVehiculo, horaIngreso) => {
  const db = await dbPromise;
  const resultado = await db.runAsync(
    'INSERT INTO ingresos_offline (placa, tipo_vehiculo, hora_ingreso, sincronizado) VALUES (?, ?, ?, 0)',
    placa, tipoVehiculo, horaIngreso
  );
  return resultado.lastInsertRowId;
};
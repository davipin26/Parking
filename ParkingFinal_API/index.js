const express = require('express');
const cors = require('cors');
const db = require('./database/db'); // Para conectar la base de datos

const app = express();

app.use(cors());
app.use(express.json());

// Esto sera una ruta de prueba
app.get('/api/estado', (req, res) => {
  res.json({ mensaje: 'API del Parqueadero funcionando correctamente' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor API corriendo en el puerto ${PORT}`);
});
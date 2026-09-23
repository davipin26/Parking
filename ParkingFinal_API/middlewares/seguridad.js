// ==========================================
// MIDDLEWARE DE SEGURIDAD
// ==========================================
const verificarSeguridad = (req, res, next) => {
  const llaveSecreta = req.headers['x-api-key'];

  if (llaveSecreta === 'SenaParking2026') {
    console.log(`[Middleware] Petición autorizada a la ruta: ${req.path}`);
    next(); 
  } else {
    console.log(`[Middleware] Intento de acceso bloqueado a: ${req.path}`);
    return res.status(401).json({ mensaje: 'Acceso denegado: API Key inválida' });
  }
};

// Exportamos la función para poder usarla en otros archivos
module.exports = { verificarSeguridad };
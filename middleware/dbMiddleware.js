const pool = require('../db');

async function dbMiddleware(req, res, next) {
    try {
        const connection = await pool.getConnection();
        req.db = connection;
        next();
    } catch (err) {
        console.error('Error al obtener la conexión de la base de datos:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

module.exports = dbMiddleware;

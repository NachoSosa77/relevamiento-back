const express = require('express');
const router = express.Router();
const dbMiddleware = require('../middleware/dbMiddleware');


router.get('/', dbMiddleware, async (req, res) => {
  try {
    const connection = req.db;
    const [result] = await connection.query('SELECT * FROM opciones_areas_exteriores');
    res.json(result);
} catch (err) {
    console.error('Error al obtener las opciones de areas exteriores:', err);
    res.status(500).json({ message: 'Error al obtener las opciones de areas exteriores' });
} finally {
    if (req.db) req.db.release();
}
});

module.exports = router;

const express = require('express');
const router = express.Router();
const dbMiddleware = require('../middleware/dbMiddleware');

router.get('/', dbMiddleware, async (req, res) => {
  try {
    const connection = req.db;
    const [results] = await connection.query('SELECT * FROM users');
    res.status(200).json(results);
} catch (err) {
    console.error('Error en la consulta:', err);
    res.status(500).json({ error: 'Error en la consulta' });
} finally {
    if (req.db) req.db.release();
}
}); 

module.exports = router;

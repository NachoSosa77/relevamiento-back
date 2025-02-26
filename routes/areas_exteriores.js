const express = require('express');
const router = express.Router();
const dbMiddleware = require('../middleware/dbMiddleware');

router.get('/', dbMiddleware, async (req, res) => {
  try {
    const connection = req.db;
    const [result] = await connection.query('SELECT * FROM areas_exteriores');
    res.json(result);
} catch (err) {
    console.error('Error al obtener las areas exteriores:', err);
    res.status(500).json({ message: 'Error al obtener las areas exteriores' });
} finally {
    if (req.db) req.db.release();
}
});

router.get('/:id', dbMiddleware, async (req, res) => {
  const id = req.params.id;
  try {
    const connection = req.db;
    const [results] = await connection.query('SELECT * FROM areas_exteriores WHERE id = ?', [id]);

    if (results.length > 0) {
        res.json(results);
    } else {
        res.status(404).json({ message: 'Área exterior no encontrado' });
    }
} catch (err) {
    console.error('Error al obtener area exterior por ID:', err);
    res.status(500).json({ message: 'Error al obtener area exterior por ID' });
} finally {
    if (req.db) req.db.release();
}
});

router.post('/', dbMiddleware, async (req, res) => {
  const { identificacionPlano, tipo, superficie, estadoConservacion, terminacionPiso } = req.body;
  try {
      const connection = req.db;
      await connection.query('INSERT INTO areas_exteriores (identificacion_plano, tipo, superficie, estado_conservacion, terminacion_piso) VALUES (?, ?, ?, ?, ?)', [identificacionPlano, tipo, superficie, estadoConservacion, terminacionPiso]);
      res.status(201).json({ message: 'Datos de área exterior insertada correctamente' });
  } catch (err) {
      console.error('Error al insertar datos del área exterior:', err);
      res.status(500).json({ message: 'Error al insertar datos del área exterior' });
  } finally {
      if (req.db) req.db.release();
  }
});

router.get('/opciones-areas-exteriores', dbMiddleware, async (req, res) => {
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

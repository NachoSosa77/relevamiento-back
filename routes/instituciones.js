const express = require('express');
const router = express.Router();
const dbMiddleware = require('../middleware/dbMiddleware');

// Ruta Establecimientos
router.get('/', dbMiddleware, async (req, res) => {
  try {
    const connection = req.db;
    const [result] = await connection.query('SELECT * FROM instituciones');
    res.json(result);
} catch (err) {
    console.error('Error al obtener las instituciones:', err);
    res.status(500).json({ message: 'Error al obtener las instituciones' });
} finally {
    if (req.db) req.db.release();
}
});

// Ruta para obtener un establecimiento por CUE
router.get('/:cui', dbMiddleware, async (req, res) => {
  const cui = req.params.cui;
  try {
    const connection = req.db;
    const [results] = await connection.query('SELECT * FROM instituciones WHERE cui = ?', [cui]);

    if (results.length > 0) {
        res.json(results);
    } else {
        res.status(404).json({ message: 'Establecimiento no encontrado' });
    }
} catch (err) {
    console.error('Error al obtener establecimiento por CUE:', err);
    res.status(500).json({ message: 'Error al obtener establecimiento por CUE' });
} finally {
    if (req.db) req.db.release();
}
});

// Ruta para cargar establecimientos
router.post('/', dbMiddleware, async (req, res) => {
  const { departamento, localidad, modalidad_nivel, institucion, cui, matricula, calle, calle_numero, referencia, provincia } = req.body;
  try {
      const connection = req.db;
      await connection.query('INSERT INTO instituciones (departamento, localidad, modalidad_nivel, institucion, cui, matricula, calle, calle_numero, referencia, provincia) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [departamento, localidad, modalidad_nivel, institucion, cui, matricula, calle, calle_numero, referencia, provincia]);
      res.status(201).json({ message: 'Establecimiento insertado correctamente' });
  } catch (err) {
      console.error('Error al insertar establecimiento:', err);
      res.status(500).json({ message: 'Error al insertar establecimiento' });
  } finally {
      if (req.db) req.db.release();
  }
});

module.exports = router;

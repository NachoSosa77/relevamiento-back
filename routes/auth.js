const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

// Ruta de registro
router.post('/register', (req, res) => {
  console.log('Petición POST a /register recibida');

  try {
      const { nombre, apellido, email, password } = req.body;

      // 1. Verifica si el usuario ya existe
      db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
          if (err) {
              console.error('Error en la consulta:', err);
              return res.status(500).json({ message: 'Error en el registro' });
          }

          if (result.length > 0) {
              return res.status(400).json({ error: 'El email ya está registrado' });
          }

          // 2. Hash de la contraseña
          bcrypt.hash(password, 10, (err, hashedPassword) => {
              if (err) {
                  console.error('Error al hashear la contraseña:', err);
                  return res.status(500).json({ error: 'Error en el registro' });
              }

              // 3. Inserta el nuevo usuario en la base de datos
              db.query('INSERT INTO users (nombre, apellido, email, password) VALUES (?, ?, ?, ?)', [nombre, apellido, email, hashedPassword], (err, result) => {
                  if (err) {
                      console.error('Error en la consulta:', err);
                      return res.status(500).json({ error: 'Error en el registro' });
                  }

                  // 4. Genera un token JWT
                  const token = jwt.sign({ id: result.insertId }, 'relevamiento-secret', { expiresIn: '1h' });

                  // 5. Envía la respuesta con el token
                  res.status(201).json({ token });
              });
          });
      });
  } catch (error) {
      console.error('Error inesperado:', error);
      res.status(500).json({ message: 'Error inesperado en el registro' });
  }
});

// Ruta de inicio de sesión
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  try {
      // 1. Verifica si el usuario existe
      db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
        //console.log("Email recibido:", email);
        //console.log("Contraseña recibida:", password);
        //console.log("Resultado de la consulta:", result);
          if (err) {
              console.error('Error en la consulta:', err);
              return res.status(500).json({ message: 'Error en el inicio de sesión' });
          }

          if (result.length === 0) { // Usuario no encontrado
              return res.status(401).json({ message: 'Credenciales inválidas' });
          }

          const user = result[0];// Obtén el primer usuario (debería ser único por email)
          const hashedPasswordFromDB = user.password; // Para mayor claridad
          //console.log("Contraseña enviada desde el frontend:", password);
          //console.log("Contraseña hasheada en la base de datos:", hashedPasswordFromDB);
          // 2. Compara la contraseña ingresada con la contraseña hasheada
          bcrypt.compare(password, hashedPasswordFromDB, (err, passwordMatch) => {
            console.log("Resultado de la comparación:", passwordMatch);
              if (err) {
                  console.error("Error al comparar contraseñas:", err);
                  return res.status(500).json({ message: 'Error en el inicio de sesión' });
              }

              if (!passwordMatch) {
                  return res.status(401).json({ message: 'Credenciales inválidas' });
              }

              const payload = {
                id: user.id,
                nombre: user.nombre,
                apellido: user.apellido,
                email: user.email,
                role: user.role,
              }

              // 3. Genera un token JWT
              const token = jwt.sign(payload, 'relevamiento-secret', { expiresIn: '1h' }); // Usa el ID del usuario

              // 4. Envía la respuesta con el token
              res.json({ token });
          });
      });
  } catch (error) {
      console.error("Error inesperado:", error);
      res.status(500).json({ message: 'Error inesperado en el inicio de sesión' });
  }
});



module.exports = router;

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const User = require('../models/User');
const config = require('../config');

const users = [];

// Ruta de registro
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verifica si el usuario ya existe
    const existingUserIndex = users.findIndex(user => user.email === email);
    if (existingUserIndex !== -1) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea un nuevo usuario
    const newUser = { email, password: hashedPassword };
    users.push(newUser);

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('aca hay error', error);
    res.status(500).json({ message: 'Error en el registro' });
  }
  console.log('USERS', users);
});

// Ruta de inicio de sesión
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verifica si el usuario existe
    const user = users.find(user => user.email === email);

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Compara la contraseña ingresada con la contraseña hasheada en la base de datos
    try {
      const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }} catch (error) {
      console.error("Error al comparar contraseñas:", error);
      return res.status(500).json({ message: 'Error en el inicio de sesión' });
    }

    const userId = user.email;

    // Genera un token JWT
    const token = jwt.sign({ userId }, config.jwtSecret, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el inicio de sesión' });
  }
  console.log('USERS LOGIN', users);
});

module.exports = router;

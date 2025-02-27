const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dbMiddleware = require('../middleware/dbMiddleware');

router.post('/register', dbMiddleware, async (req, res) => {
    console.log('Petición POST a /register recibida');
    const { nombre, apellido, email, password } = req.body;
    try {
        const connection = req.db; // Obtiene la conexión de req.db

        // 1. Verifica si el usuario ya existe
        const [existingUsers] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        // 2. Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Inserta el nuevo usuario en la base de datos
        const [result] = await connection.query('INSERT INTO users (nombre, apellido, email, password) VALUES (?, ?, ?, ?)', [nombre, apellido, email, hashedPassword]);

        // 4. Genera un token JWT
        const token = jwt.sign({ id: result.insertId }, 'relevamiento-secret', { expiresIn: '1h' });

        // 5. Envía la respuesta con el token
        res.status(201).json({ token });
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ message: 'Error en el registro' });
    } finally {
        if (req.db) req.db.release(); // Libera la conexión
    }
});

// Ruta de inicio de sesión
router.post('/login', dbMiddleware, async (req, res) => {
    const { email, password } = req.body;
    try {
        const connection = req.db; // Obtiene la conexión de req.db
        // 1. Verifica si el usuario existe
        const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const user = users[0];
        const hashedPasswordFromDB = user.password;

        // 2. Compara la contraseña ingresada con la contraseña hasheada
        const passwordMatch = await bcrypt.compare(password, hashedPasswordFromDB);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const payload = {
            id: user.id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            role: user.role,
        };

        // 3. Genera un token JWT
        const token = jwt.sign(payload, 'relevamiento-secret', { expiresIn: '1h' });

        // 4. Envía la respuesta con el token
        res.json({ token });
    } catch (error) {
        console.error("Error inesperado:", error);
        res.status(500).json({ message: 'Error inesperado en el inicio de sesión' });
    } finally {
        if (req.db) req.db.release(); // Libera la conexión
    }
});

module.exports = router;

const express = require('express');
const cors = require('cors'); // Importa el paquete cors
//const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const config = require('./config');

const app = express();

// Opciones de CORS (puedes personalizarlas)
const corsOptions = {
  origin: 'http://localhost:3000', // Reemplaza con el origen de tu frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
  credentials: true, // Si necesitas enviar cookies o credenciales
};

app.use(cors(corsOptions)); // Usa el middleware cors con las opciones

// ... (resto de tu código: rutas, etc.)

// Conexión a la base de datos MongoDB
/* mongoose.connect(config.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error de conexión a MongoDB:', err)); */

app.use(express.json());

// Rutas de autenticación
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

const express = require('express');
const cors = require('cors'); // Importa el paquete cors
const authRoutes = require('../routes/auth');
const usersRoutes = require('../routes/users');
const institucionesRoutes = require('../routes/instituciones');
const areasExterioresRoutes = require('../routes/areas_exteriores');
const opcionesAreasExterioresRoutes = require('../routes/opciones');
const app = express();

// Opciones de CORS (puedes personalizarlas)
const corsOptions = {
  origin: 'http://localhost:3000', // Reemplaza con el origen de tu frontend
  //origin: 'https://relevamiento-app-rim7.vercel.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
  credentials: true, // Si necesitas enviar cookies o credenciales
};

app.use(cors(corsOptions)); // Usa el middleware cors con las opciones
app.use(express.json());

// Rutas de autenticación
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes); // Usa la ruta de usuarios
app.use('/api/instituciones', institucionesRoutes); // Usa la ruta de instituciones
app.use('/api/areas-exteriores', areasExterioresRoutes); // Usa la ruta de areas exteriores
app.use('/api/opciones-areas-exteriores', opcionesAreasExterioresRoutes); // Usa la ruta de opciones de areas exteriores


app.get("/", (req, res)=> res.send("Express on Vercel"))
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

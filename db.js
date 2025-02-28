const mysql = require('mysql2/promise');
const config = require('./config'); // Archivo de configuración

const pool = mysql.createPool({
  host: config.dbHost, // Host de la base de datos
  user: config.dbUser, // Usuario de la base de datos
  password: config.dbPassword, // Contraseña de la base de datos
  database: config.dbName, // Nombre de la base de datos
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Conexión a la base de datos establecida correctamente');
    connection.release(); // Libera la conexión de vuelta al pool
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
}

testConnection(); // Llama a la función para probar la conexión
//console.log('Conectado a la base de datos', pool);

module.exports = pool;

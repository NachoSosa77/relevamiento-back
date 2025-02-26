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

//console.log('Conectado a la base de datos', pool);

module.exports = pool;

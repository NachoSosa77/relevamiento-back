const mysql = require('mysql2');
const config = require('./config'); // Archivo de configuración

const connection = mysql.createConnection({
    host: config.dbHost, // Host de la base de datos
    user: config.dbUser, // Usuario de la base de datos
    password: config.dbPassword, // Contraseña de la base de datos
    database: config.dbName, // Nombre de la base de datos
});

//console.log('CONEXION', connection)

connection.connect((err) => {
    if (err) {
        console.error('Error de conexión a MySQL:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

module.exports = connection;
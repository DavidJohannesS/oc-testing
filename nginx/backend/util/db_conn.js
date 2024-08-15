const mysql = require('mysql');

const pool = mysql.createPool({
  host: '192.168.0.22',
  port: 3306,
  user: 'root',
  password: 'ourpassword',
  database: 'gradeup',
  charset: 'utf8'
});

pool.getConnection((err, connection) => {
  if(err) {
    console.error("Connection Error: " + err.message);
  } else {
    console.log("Connected to the database.");
    connection.release();
  }
});

module.exports = pool;


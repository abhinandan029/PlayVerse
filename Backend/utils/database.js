import mysql from 'mysql2/promise'

const DB = mysql.createPool({
  host : "localhost",
  user : "root",
  password : "Abhi@2903",
  database : "playverse",
  waitForConnection : true,
  connectionLimit : 10,
  queueLimit : 0
})

DB.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database.');
  connection.release();
});

export default DB
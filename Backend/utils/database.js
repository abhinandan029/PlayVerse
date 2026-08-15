import mysql from 'mysql2/promise'

const DB = mysql.createPool({
  host : "localhost",
  user : "root",
  password : "Abhi@2903",
  database : "playverse",
  waitForConnections : true,
  connectionLimit : 10,
  queueLimit : 0
})

export default DB
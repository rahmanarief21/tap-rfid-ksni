const mysql = require("mysql");
require("dotenv").config();

const hostname = process.env.DB_HOST;
const dbname = process.env.DB_DBNAME;
const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

const connection = mysql.createConnection({
  host : hostname,
  user : username,
  password : password,
  database : dbname,
  multipleStatements : true
});

connection.connect( (err) => {
  if (err) throw err;
  console.log("Success To Connect");
})

module.exports = connection;
const mysql = require("mysql");
const dbConfig = require("../config/config.db.js");

const connection = mysql.createConnection({
  host : dbConfig.host,
  user : dbConfig.user,
  password : dbConfig.password,
  database : dbConfig.database,
  multipleStatements : true
});

connection.connect( (err) => {
  if (err) throw err;
  console.log("Success To Connect");
})

module.exports = connection;
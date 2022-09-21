const mysql = require("mysql");

const koneksi = mysql.createConnection({
  host : "192.168.11.23",
  user : 'hrdb',
  password : 'hrnabatirck',
  database : 'dashboard',
  multipleStatements : 'true'
});

koneksi.connect((err) => {
  if (err) throw err;
  console.log("Mysql Connected");
});

const express = require('express');
const bodyParser = require('body-parser');
const koneksi = require("./config/database");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended : false
}));

app.get("/", (req, res) => {
  res.status(403);
});


app.get("/api/rest-card", (req, res) => {
  const sqlQuery = "SELECT * FROM tbl_gi_kartu_istirahat WHERE deleted_at = '0'";

  koneksi.query(sqlQuery, (err, rows, field) => {
    if (err) {
      return res.status(500).json({
        message : "Query Error",
        error : err
      });
    }

    res.status(200).json({
      success : true,
      data : rows
    });
  });
})


app.listen(PORT, () => console.log(`Running Server at Port : ${PORT}`));
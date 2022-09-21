const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended : false
}));

app.get("/", (req, res) => {
  res.status(403).json({
    message : "Forbidden Area"
  });
});


app.listen(PORT, () => console.log(`Running Server at Port : ${PORT}`));
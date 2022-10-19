const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// a route for home page
app.get("/home", (req, res) => {
  res.json({ message: "NodeJs CRUD Application" });
});

app.get("/get-all-routes", (req, res) => {  
  let get = app._router.stack.filter(r => r.route && r.route.methods.get).map(r => r.route.path);
  let post = app._router.stack.filter(r => r.route && r.route.methods.post).map(r => r.route.path);
  res.send({ get: get, post: post });
});


require("./app/routes/kartu_istirahat.routes.js")(app);
require("./app/routes/kartu_terakhir.routes")(app);
require("./app/routes/home.routes")(app);
require("./app/routes/transaksi_kartu_istirahat.routes")(app);

// setting port to 3000, & listening for requests http request.
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
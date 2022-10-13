module.exports = app => {

  const kartuTerakhir =  require("../controllers/kartu_terakhir.controller");


  app.post("/api/kartu_terakhir", kartuTerakhir.create);

  app.get("/api/kartu_terakhir/sektor/:idLokasi", kartuTerakhir.getLastCard);

};
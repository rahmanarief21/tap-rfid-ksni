module.exports = app => {
  
  const kartuIstirahat = require("../controllers/kartu_istirahat.controller.js");

  app.post("/api/kartu_istirahat", kartuIstirahat.create);
  
  app.get("/api/kartu_istirahat", kartuIstirahat.findAll);

  app.get("/api/kartu_istirahat/:idKartu", kartuIstirahat.findOne);
  
  app.put("/api/kartu_istirahat/:idKartu", kartuIstirahat.update);

  app.delete("/api/kartu_istirahat/:idKartu", kartuIstirahat.delete);

  app.delete("/api/kartu_istirahat/", kartuIstirahat.deleteAll);

  app.post("/api/kartu_istirahat/set_get_card/", kartuIstirahat.useUnuseCard);

  app.get("/api/kartu_istirahat_count/", kartuIstirahat.countCard);

  app.get("/api/kartu_istirahat_count/:idLokasi", kartuIstirahat.countCard);

  app.get("/api/test_routes/:idLokasi", kartuIstirahat.getLatestCard);
  
  app.get("/api/total_kartu_istirahat", kartuIstirahat.getTotalCardEveryLocation);//for test new method

  app.get("/api/total_di_lokasi/:location_id", kartuIstirahat.getDetailRestCardByLocation);
}
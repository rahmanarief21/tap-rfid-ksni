module.exports = app => {
  
  const kartuIstirahat = require("../controllers/kartu_istirahat.controller.js");

  app.post("/api/kartu_istirahat", kartuIstirahat.create);
  
  app.get("/api/kartu_istirahat", kartuIstirahat.findAll);

  app.get("/api/kartu_istirahat/:idKartu", kartuIstirahat.findOne);
  
  app.put("/api/kartu_istirahat/:idKartu", kartuIstirahat.update);

  app.delete("/api/kartu_istirahat/:idKartu", kartuIstirahat.delete);

  app.delete("/api/kartu_istirahat/", kartuIstirahat.deleteAll);

}
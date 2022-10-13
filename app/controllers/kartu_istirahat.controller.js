const KartuIstirahat = require("../models/kartu_istirahat.model.js");

//Kartu Baru
exports.create = (req, res) => {

  //Validasi
  if (!req.body) {
    res.status(400).send({
      message : "Data Tidak Boleh Kosong"
    });
  }

  //Data Baru
  const kartu = new KartuIstirahat({
    noKartu : req.body.noKartu,
    lokasiKartu : req.body.lokasiKartu,
    statusKartu : req.body.statusKartu
  });

  console.log(req.body.noKartu);

  //Save Data
  KartuIstirahat.create(kartu, (err, data) => {
    if (err)
      res.status(500).send({
        message : err.message || "Error Data"
      });
    else res.send(data);
      
  });
};

exports.findAll = (req, res) => {

  KartuIstirahat.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message :
          err.message || "Error Data"
      });
    else res.send(data);
  });

};

exports.findOne = (req, res) => {

  KartuIstirahat.findById(req.params.idKartu, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message : `Data Kartu Istirahat dengan id ${req.params.idKartu} tidak ditemukan.` 
        });
      } else {
        res.status(500).send({
          message : `Error saat mencoba mencari data ${req.params.idKartu}.`
        });
      }
    } else res.send(data);
  });
};

exports.update = (req, res) => {

  if (!req.body) {
    res.status(400).send({
      message : "Data Tidak Boleh Kosong"
    });
  }

  KartuIstirahat.updateById(req.params.idKartu, new KartuIstirahat(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message : `Data Kartu Istirahat dengan Id ${req.params.idKartu} Tidak Ditemukan`
        });
      } else {
        res.status(500).send({
          message : `Error Saat Update data dengan id ${req.params.idKartu}`
        });
      }
    } else res.send(data);
  });

};

exports.delete = (req, res) => {
  KartuIstirahat.remove(req.params.idKartu, (err, data) => {
    if (err) {
      if (err.kind == "not_found") {
        res.status(404).send({
          message : `Data Kartu Istirahat dengan Id ${req.params.idKartu} Tidak Ditemukan`
        });
      } else {
        res.status(500).send({
          message : `Error Saat Update data dengan id ${req.params.idKartu}`
        });
      }
    } else res.send(data);
    
  });
};

exports.deleteAll = (req, res) => {
  KartuIstirahat.removeAll((err, data) => {
    if (err) 
      res.status(500).send({
        message : "Data Tidak Bisa didelete"
      });
    else res.send(data);
  });
};


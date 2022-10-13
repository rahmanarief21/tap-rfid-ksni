const KartuTerakhir = require("../models/kartu_terakhir.model");
const KartuIstirahat = require("../models/kartu_istirahat.model");

const validator = require("validator");

exports.create = (req, res) => {
  
  let emptys = {};

  emptys.idKartu = !validator.isEmpty(req.body.idKartu);
  emptys.lokasiIstirahat = !validator.isEmpty(req.body.lokasiIstirahat);

  let hasEmpty = Object.values(emptys).includes(false)
  
  if (hasEmpty) {
    res.status(400).send({
      message : "Tidak Boleh Ada Kolom Kosong"
    });
  }

 const AmbilKartu = new KartuTerakhir({
  idKartu : req.body.idKartu,
  lokasiIstirahat : req.body.lokasiIstirahat
 })

  KartuTerakhir.create(AmbilKartu, (err, data) => {
    if (err)
      res.status(500).send({
        messeage : "Error Menambahkan Data"
      });
    else res.send(data);
  })
};

exports.getLastCard = (req, res) => {
  
  if (
    validator.isEmpty(req.params.idLokasi)
  ) {
    res.send(400).send({
      message : "Lokasi Tidak Boleh Kosong"
    });
  }

  //Check Ketersediaan Kartu Pada Lokasi
  KartuIstirahat.existInLocation(req.params.idLokasi, (err, jmlKartu) => {
    if (jmlKartu[0].jml_kartu == 0) {
      res.status(500).send({
        message : 'Kartu Istirahat Tidak Tersedia / Habis Pada Sektor Anda'
      })
    }
  });

};
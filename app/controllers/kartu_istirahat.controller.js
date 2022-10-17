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
          message : `Data Kartu Istirahat dengan id ${req.params.idKartu} tidak ditemukan.`,
          isEmpty : true
        });
      } else {
        res.status(500).send({
          message : `Error saat mencoba mencari data ${req.params.idKartu}.`,
          isEmpty : true
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

//Gunakan/Tidak Gunakan Kartu Istirahat Sesuai ID yang diberikan , beserta dengan status yang diinginkan
exports.useUnuseCard = (req, res) => {
  if (!req.body){
    res.status(400).send({
      message : "Data Tidak Boleh Kosong"
    });
  }

  let id_kartu = req.body.idKartu; //id kartu istirahat
  let status_kartu_to = req.body.statusKartu; //perubahan status kartu => use : 0, unuse : 1

  let kartu_istirahat = {
    idKartu : id_kartu,
    statusKartu : status_kartu_to
  }

  KartuIstirahat.useUnuseCard(kartu_istirahat, (err, data) => {
    if (err) {
      res.status(500).send({
        message : "Gagal Ambil/Kembalikan Kartu"
      });
    } else res.send(data);
  });
};

exports.countCard = (req, res) => {
  let idKLokasi = false;
  if (req.params.idLokasi !== "") {
    idLokasi = req.params.idLokasi
  }

  KartuIstirahat.countCard(idLokasi, (err, data) => {
    if (err) {
      res.status(500).send({
        message : "Data Tidak Bisa dihitung"
      });
    }
    else res.send(data);
  });
};

exports.getLatestCard = (req, res) => {
  let locationId = "";

  if (req.params.idLokasi == "")
  {
    res.status(400).send({
      message : "Data Tidak Boleh Kosong"
    });
  }

  locationId = req.params.idLokasi;

  KartuIstirahat.getLastCardByLocation(locationId, (err, data) => {
    if (err) {
      res.status(500).send({
        message : "Data Error"
      });
    }else if (data.length == 0) {
      data.status(500).send({
        message : "Tidak Ada Kartu di Lokasi Tersebut"
      });
    } else res.send(data);
  });
};

const sql = require("./db");


const KartuTerakhir = function(kartuTerakhir){
  this.id_kartu = kartuTerakhir.idKartu;
  this.lokasi_istirahat = kartuTerakhir.lokasiIstirahat;
}

KartuTerakhir.create = (AmbilKartu, result) => {
  sql.query("INSERT INTO tbl_gi_kartu_terakhir SET ?", AmbilKartu, (err, res) => {
    if (err) {
      console.log("error : ", err);
      result(err, null);
      return;
    }

    console.log("Kartu Sudah diambil :", { id : res.insertId, ...AmbilKartu});
    result(null, { id : res.insertId, ...AmbilKartu});
  });
};

KartuTerakhir.findLastCardByLocation = (LokasiIstirahat, result) => {
  sql.query(
    "SELECT * FROM tbl_gi_kartu_terakhir WHERE lokasi_istirahat = ? AND deleted_at = '0' ORDER BY id_kartu DESC LIMIT 1", 
    [LokasiIstirahat], 
    (err, res) => {
      if (err) {
        console.log("error : ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("Berikut :", res);
        result(null, res);
        return;
      }

      result({kind : "not_found"}, null);
        
    });
};

module.exports = KartuTerakhir;
const sql = require("./db.js");


// urutan :
// field on table = field dari controller
const KartuIstirahat = function(kartuIstirahat){
  this.no_kartu = kartuIstirahat.noKartu;
  this.lokasi_kartu = kartuIstirahat.lokasiKartu;
  this.status_kartu = kartuIstirahat.statusKartu;
};

KartuIstirahat.create = (NoKartuBaru, result) => {
  sql.query("INSERT INTO tbl_gi_kartu_istirahat SET ?", NoKartuBaru, (err, res) => {
    if (err) {
      console.log("error : ", err);
      result(err, null);
      return;
    }

    console.log("No Kartu Baru: ", { id : res.insertId, ...NoKartuBaru});
    result(null, { id : res.insertId, ...NoKartuBaru});

  });
};

KartuIstirahat.findById = (kartuId, result) => {
  sql.query(`SELECT * FROM tbl_gi_kartu_istirahat WHERE id = ${kartuId} AND deleted_at = '0'`, (err, res) => {
    if (err) {
      console.log("error : ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("Kartu ditemukan : ", res[0]);
      result(null, res[0]);
      return;
    }

    result({
      kind : "not_found"
    }, null);
  });
};

KartuIstirahat.existInLocation = (idLokasi, result) => {
  sql.query(
    `SELECT count(id) AS jml_kartu FROM tbl_gi_kartu_istirahat WHERE lokasi_kartu = ${idLokasi} AND status_kartu = 1`, 
    (err, res) => {
      if (err) {
        console.log("error : ", err);
        return;
      }

      if (res.length) {
        console.log("Jumlah Kartu : ", res);
        result(null, res);
      }
    });
};

KartuIstirahat.getAll = result => {
  sql.query("SELECT * FROM tbl_gi_kartu_istirahat WHERE deleted_at = '0'", (err, res) => {
    if (err) {
      console.log("error : ", err);
      result(null, err);
      return;
    }

    console.log("Kartu Istirahat", res);
    result(null, res);
  });
};

KartuIstirahat.updateStatus = (idKartu, kartuIstirahat, result) => {
  sql.query("UPDATE tbl_gi_kartu_istirahat SET status_kartu = ? WHERE id = ?", [kartuIstirahat.statusKartu, idKartu], (err, res) => {
    if (err) {
      console.log("error : ", err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({
        kind : 'not_found'
      }, null);
      return;
    }

    console.log("Update Status Kartu : ", {id : idKartu, ...kartuIstirahat});
    result(null, {id : idKartu, ...kartuIstirahat});
  });
};

KartuIstirahat.updateById = (idKartu, kartuIstirahat, result) => {
  sql.query("UPDATE tbl_gi_kartu_istirahat SET no_kartu=?, lokasi_kartu=?, status_kartu = ? WHERE id = ?", [kartuIstirahat.no_kartu, kartuIstirahat.lokasi_kartu, kartuIstirahat.status_kartu, idKartu], (err, res) => {
    if (err) {
      console.log("error : ", err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({
        kind : 'not_found'
      }, null);
      return;
    }
    console.log(kartuIstirahat);
    console.log("Update Kartu : ", {id : idKartu, ...kartuIstirahat});
    result(null, {id : idKartu, ...kartuIstirahat});
  });
};

KartuIstirahat.softRemove = (idKartu, result) => {
  sql.query("UPDATE tbl_gi_kartu_istirahat SET deleted_at = CURRENT_TIMESTAMP() WHERE id = ? AND deleted_at = '0'", idKartu, (err, res) => {
    if (err) {
      console.log("error : ", err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({
        kind : "not_found"
      }, null);
      return;
    }

    console.log("Kartu Istirahat yang di Hapus dengan id : ", idKartu);
    result(null, res);
  });
};

KartuIstirahat.softRemoveAll = result => {
  sql.query("UPDATE tbl_gi_kartu_istirahat SET deleted_at = CURRENT_TIMESTAMP() WHERE deleted_at = '0'", (err, res) => {
    if (err) {
      console.log("error : ", err);
      result(err, null);
      return;
    }

    console.log(`Kartu Yang di Hapus Sebanyak ${res.affectedRows} Kartu`);
    result(null, res);
  });
};

KartuIstirahat.remove = (idKartu, result) => {
  sql.query(`DELETE FROM tbl_gi_kartu_istirahat WHERE id = ${idKartu}`, (err, res) => {
    if (err) {
      console.log("error : ", err);
      result(err, null);
      return;
    }
    
    console.log(`Kartu dengan id ${idKartu} telah dihapus permanen`);
    result(null, {id : idKartu, message : "delete_success"});
  });
};

module.exports = KartuIstirahat;
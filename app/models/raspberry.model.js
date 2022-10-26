const sql = require("./db.js");

const Raspberry = (raspberry) => {
    this.ip_address = raspberry.ip_address;
    this.nama_lokasi = raspberry.nama_lokasi;
    this.alias = raspberry.alias;
};

Raspberry.getOneByIpAddress = (ip_address_raspberry, result) => {
    let querySql = `SELECT id, ip_address, nama_lokasi, id_sektor FROM tbl_raspberry WHERE del_status = 0 AND ip_address='${ip_address_raspberry}'`;

    sql.query(querySql, (err, res) => {
        if (err) {
            console.log("error :", err);
            result(err, null);
            return;
        }

        if (res.length > 0) {
            result(null, res);
            return
        }

        result({kind : "not_found", data_from_client : ip_address_raspberry}, null);
    });
};

module.exports = Raspberry;
const sql = require("./db.js");

const TransaksiIstirahat = (transaksiIstirahat) => {
	this.nik = transaksiIstirahat.nikKaryawan;
	this.lokasi_istirahat = transaksiIstirahat.lokasiIstirahat;
	this.type_transaksi = transaksiIstirahat.typeTransaksi;
	this.id_kartu = transaksiIstirahat.idKartu;
};



module.exports = TransaksiIstirahat;
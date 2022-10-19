const sql = require("./db.js");

const TransaksiIstirahat = (transaksiIstirahat) => {
	this.nik = transaksiIstirahat.nikKaryawan;
	this.lokasi_istirahat = transaksiIstirahat.lokasiIstirahat;
	this.type_transaksi = transaksiIstirahat.typeTransaksi;
	this.id_kartu = transaksiIstirahat.idKartu;
};

TransaksiIstirahat.create = (transaksiBaru, result) => {
	sql.query("INSERT INTO tbl_gi_transaksi SET ?", transaksiBaru, (err, res) => {
		if (err) {
			console.log("error : ", err);
			result(err, null);
			return;
		}

		console.log(res);
		result(null, {
			id : res.insertId,
			data : { ...transaksiBaru }
		});
	});
};

TransaksiIstirahat.getAll = result => {
	sql.query(
		"SELECT trk.id, trk.nik, kry.nama, dept.nama_dept, trk.lokasi_istirahat, sktr.nama_sektor, trk.type_transaksi, trk.id_kartu, krt.no_kartu FROM tbl_gi_transaksi AS trk INNER JOIN tbl_karyawan AS kry ON trk.nik = kry.nik INNER JOIN tbl_dept AS dept ON kry.dept = dept.kode INNER JOIN tbl_sektor AS sktr ON trk.lokasi_istirahat = sktr.id INNER JOIN tbl_gi_kartu_istirahat AS krt ON trk.id_kartu = krt.id WHERE trk.deleted_at='0'", 
		(err, res) => {
			if (err) {
				console.log("error : ", err);
				result(err, null);
				return;
			}

			console.log(res);
			result(null, res);
		});
};

TransaksiIstirahat.getOneById = (idTransaction, result) => {
	let querySql = `SELECT trk.id, trk.nik, kry.nama, dept.nama_dept, trk.lokasi_istirahat, sktr.nama_sektor, trk.type_transaksi, trk.id_kartu, krt.no_kartu FROM tbl_gi_transaksi AS trk INNER JOIN tbl_karyawan AS kry ON trk.nik = kry.nik INNER JOIN tbl_dept AS dept ON kry.dept = dept.kode INNER JOIN tbl_sektor AS sktr ON trk.lokasi_istirahat = sktr.id INNER JOIN tbl_gi_kartu_istirahat AS krt ON trk.id_kartu = krt.id WHERE trk.deleted_at='0' AND trk.id = ${idTransaction}`;

	sql.query(querySql, (err, res) => {
		if (res.length) {
			console.log(res);
			result(null, res);
			return;
		} 

		if (err) {
			console.log("error : ", err);
			result(err, null);
			return;
		}

		
		result({
			kind : "not_found"
		}, null);
	});
};

TransaksiIstirahat.deleteById = (idTransaction, result) => {
	let querySql = `DELETE FROM tbl_gi_transaksi WHERE id = ${idTransaction}`;

	sql.query(querySql, (err, res) => {
		if (err) {
			console.log("error : ", err);
			result(err, null);
			return;
		}

		if (res.affectedRows == 0) {
			console.log(`Tidak Ditemukan ${idTransaction}`);
			result({kind : "not_found"}, null);
			return;	
		}


		console.log(res);
		result(null, {res, msg : "delete_success"});
	});
};
module.exports = TransaksiIstirahat;
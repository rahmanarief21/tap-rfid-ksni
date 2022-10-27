const sql = require("./db.js");
const moment = require("moment");

const TransaksiIstirahat = (transaksiIstirahat) => {
	this.nik = transaksiIstirahat.nikKaryawan;
	this.lokasi_istirahat = transaksiIstirahat.lokasiIstirahat;
	this.type_transaksi = transaksiIstirahat.typeTransaksi;
	this.id_kartu = transaksiIstirahat.idKartu;
};

TransaksiIstirahat.create = (transaksiBaru, result) => {

	let sql_set_transaksi = `INSERT INTO tbl_gi_transaksi SET nik='${transaksiBaru.nik}', type_transaksi= ${transaksiBaru.type_transaksi}, id_kartu= ${transaksiBaru.id_kartu} , lokasi_istirahat= ${transaksiBaru.lokasi_istirahat[0].id_sektor} `;

	sql.query(sql_set_transaksi, (err, res) => {
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

TransaksiIstirahat.getStatusTransaksiByEmpId = (emp_id, result) => {
	let querySql = `SELECT * FROM tbl_gi_status_istirahat AS trk_sts WHERE trk_sts.nik = '${emp_id}' AND trk_sts.created_at >= DATE_SUB(now(), interval 8 hour)`;

	sql.query(querySql, (err, res) => {
		if (err) {
			console.log("error :", err);
			result(err, null);
			return;
		}

		if (res.length) {
			console.log(res);
			result(null, res);
			return;
		}

		result({kind : "not_found"}, null);
		console.log(querySql)
	});
};

TransaksiIstirahat.insertRestStatus = (data_insert, result) => {
	let nik = data_insert.nik
	let id_transaction = data_insert.rest_transaction_id;
	let type_transaction = data_insert.type_transaksi;
	let querySql = "";

	if (type_transaction == 0) {
		let transaction_status_id = data_insert.transaction_status_id;
		querySql = `UPDATE tbl_gi_status_istirahat SET status_istirahat = ${type_transaction}, rest_in = ${id_transaction} WHERE id = ${transaction_status_id}`;
		console.log(querySql);
	} else {
		querySql = `INSERT INTO tbl_gi_status_istirahat SET nik = '${nik}', status_istirahat = ${type_transaction}, rest_out = ${id_transaction}`;	
	}

	sql.query(querySql, (err, res) => {
		if (err) {
			console.log("error : ", err);
			result(err, null);
			return;
		}

		if (type_transaction == 0 && res.affectedRows < 1)
		{
			result({
				kind : 'not_found'
			}, null);
			return;
		}

		let result_set = {};
		result_set.id_transaksi = res.insertId;
		result_set.nik = nik;
		result_set.type_transaksi = type_transaction;

	result(null, result_set);
		console.log(result_set);
	});
};

TransaksiIstirahat.calculateRestDuration = (data_to_calculate, result) => {
	let id_transaksi = data_to_calculate.id_transaksi;

	let sql_get_transcation = `SELECT id, rest_out, rest_in FROM tbl_gi_status_istirahat WHERE id = ${id_transaksi} AND status_istirahat = 0`;

	sql.query(sql_get_transcation, (errorQueryTransaction, resultQueryTraansaction) => {
		if (errorQueryTransaction) {
			result({
				step : "transaction_check",
				err : errorQueryTransaction
			}, null);
			console.log(errorQueryTransaction);
			return;
			
		}

		let result_check_transaction = resultQueryTraansaction[0];

		let rest_in_transaction_id = result_check_transaction.rest_in;
		let rest_out_transaction_id = result_check_transaction.rest_out;

		let sql_get_rest_detail = `SELECT id, created_at FROM tbl_gi_transaksi WHERE id IN (${rest_in_transaction_id}, ${rest_out_transaction_id}) ORDER BY created_at DESC`;

		sql.query(sql_get_rest_detail, (errQueryRestDetail, resultQueryRestDetail) =>{
			if (errQueryRestDetail) {
				result({
					step : "rest_detail_check",
					err : errQueryRestDetail
				}, null);
				console.log(errQueryRestDetail);
				return;
			}

			let rest_in_time = moment(resultQueryRestDetail[0].created_at);
			let rest_out_time = moment(resultQueryRestDetail[1].created_at);
			let diff_rest_time_in_seconds = rest_in_time.diff(rest_out_time);
			let diff_time = moment.utc(diff_rest_time_in_seconds).format("HH:mm:ss");

			let sql_set_duration = `UPDATE tbl_gi_status_istirahat SET durasi = '${diff_time}' WHERE id = ${id_transaksi}`;

			sql.query(sql_set_duration, (errQuerySetDuration, resultQuerySetDuration) => {
				if (errQuerySetDuration) {
					result({
						step : "rest_set_duration",
						err : errQuerySetDuration
					});
					console.log(errQuerySetDuration);
					return;
				}
				result(null, {
					id : resultQuerySetDuration
				});
				console.log(sql_set_duration);
			});
		});
	});
};

TransaksiIstirahat.getDetailTransaksiById = (transaction_id, result) => {
	let queryGetTransactionDetail = `SELECT sts.id, sts.nik, sts.rest_out, trk_out.created_at AS time_out, sts.rest_in, trk_in.created_at AS time_in, sts.durasi, trk_out.id_kartu FROM tbl_gi_status_istirahat AS sts INNER JOIN tbl_gi_transaksi AS trk_out ON sts.rest_out = trk_out.id LEFT JOIN tbl_gi_transaksi AS trk_in ON sts.rest_in = trk_in.id WHERE sts.id = ${transaction_id}`;

	sql.query(queryGetTransactionDetail, (errGetDetailTransaction, resultGetDetailTransaction) => {
		if (errGetDetailTransaction) {
			result(errGetDetailTransaction, null);
			console.log(errGetDetailTransaction);
			return;
		}
		
		if (resultGetDetailTransaction.length > 0) {
			result(null, resultGetDetailTransaction);
			return;
		}

		result({
			kind : "not_found",
			sql : queryGetTransactionDetail
		}, null);
	});
};

TransaksiIstirahat.getLatestRestCardInTransactionByLocation = (location_id, result) => {
	let sqlLatestCard = `SELECT id, id_kartu, type_transaksi FROM tbl_gi_transaksi WHERE lokasi_istirahat = ${location_id}`;

	sql.query(sqlLatestCard, (errLatestCard, resultLatestCard) => {
		if (errLatestCard) {
			result(errLatestCard, null);
			console.log(errLatestCard);
		}

		if (resultLatestCard.length > 0) {
			result(null, resultLatestCard)
		}

		result({
			kind : "not_found"
		})
	})
};

module.exports = TransaksiIstirahat;
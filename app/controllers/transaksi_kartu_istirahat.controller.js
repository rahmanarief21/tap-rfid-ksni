const TransaksiIstirahat = require('../models/transaksi_kartu_istirahat.model.js');
const KartuIstirahat = require('../models/kartu_istirahat.model.js');
const Karyawan = require("../models/karyawan.model.js");
const Raspberry = require("../models/raspberry.model.js");
const { Result } = require('express-validator');

const errMsg = {
	"not_found" : "Data Tidak Ditemukan"
};

//method untuk membuat transaksi baru jartu istirahat (umum)
exports.createTransaction = (req, res) => {
	if (!req.body) {
		res.status(400).send({
			message : "Data Tidak Boleh Kosong"
		});
	}

	let trkBaru = {};

	trkBaru.nik = req.body.nikKaryawan;
	trkBaru.lokasi_istirahat = req.body.lokasiIstirahat;
	trkBaru.type_transaksi = req.body.typeTransaksi;
	trkBaru.id_kartu = req.body.idKartu;

	TransaksiIstirahat.create(trkBaru, (err, data) => {
		if (err) {
			res.status(500).send({
				message : "Kesalahan Saat Proses Data"
			});
		}else res.send(data);
	});
};

exports.getAllTransaction = (req, res) => {
	TransaksiIstirahat.getAll((err, data) => {
		if(err) {
			res.status(500).send({
				message : "Kesalahan Saat Proses Data"
			});
		} else res.send(data);
	});
};

exports.getOneTransactionById = (req, res) => {

	let idTransaksi = req.params.idTransaction;

	TransaksiIstirahat.getOneById(idTransaksi, (err, data) => {
		if (err) {
			if (err.kind === "not_found") {
			res.status(400).send({
				message : `Transaksi dengan id ${idTransaksi} tidak ditemukan`
			});
			} else {
				res.status(500).send({
					message : "Kesalahan Saat Proses Data"
				});
			}	
		} else res.send(data);
	});
};

exports.deleteTransactionById = (req, res) => {
	let idTransaksi = req.params.idTransaction;

	TransaksiIstirahat.deleteById(idTransaksi, (err, data) => {
		if (err) {
			if (err.kind) {
				res.status(400).send({
					message : errMsg[err.kind]
				})
			} else {
				res.status(500).send({
					message : "Kesalahan Saat Proses Data"
				});	
			}
			
		} else res.send(data);

	});
};

exports.getStatusTransaksiByEmpId = (req, res) => {
	let emp_id = req.params.emp_id;

	TransaksiIstirahat.getStatusTransaksiByEmpId(emp_id, (err, data) => {
		if (err) {
			res.status(500).send({
				err : err
			})
		} else res.send(data);
		
	})
};

exports.setRestDuration = (req, res) => {
	let transaction_id = {
		id_transaksi : req.body.transaction_id
	};

	TransaksiIstirahat.calculateRestDuration(transaction_id, (err, data) => {
		if (err) {
			res.status(500).send({
				message : err
			});
		} else res.send(data);
	});
};

exports.getStatusTransactionByRfidOrEmpId = (req, res) => {
	if (!req.body.emp_or_rfid) {
		res.status(400).send({
			message : "Data Tidak Boleh Kosong",
			transaction_sts : false
		})
		return;
	}

	let id_to_search_emp = req.body.emp_or_rfid;
	let rest_location = req.ip;
	
	Karyawan.getOneByNik(id_to_search_emp, (errGetDataEmp, dataEmp) => {
		if (errGetDataEmp) {
			 if (errGetDataEmp.kind == "not_found") {
				res.status(500).send({
					message : "NIK / RFID Tidak Terdaftar",
					transaction_sts : false
				});
				return;
			 } else {
				res.status(500).send({
					message : "Error Ambil Data Karyawan",
					transaction_sts : false
				});
				return;
			 }
		}

		let emp_data = dataEmp[0];

		TransaksiIstirahat.getStatusTransaksiByEmpId(emp_data.nik, async (errGetTransaction, dataGetTransaction) => {
			let status_transaksi = {};

			if (errGetTransaction) {
				if (errGetTransaction.kind == "not_found") {
					// get card
					res.send({
						transaction_sts : true,
						emp_id : emp_data.nik,
						transaction_next_type : 1
					})
				} else {
					res.status(500).send({
						message : "Error Ambil Data Transaksi Istirahat",
						transaction_sts : false
					});
				}				
			} else {
				let data_transaction = dataGetTransaction[0];
				let getDetailTransaction = await promiseGetTransactionDetailFromRestStatus(data_transaction.id);

				if (data_transaction.status_istirahat == 0) {
					
					res.status(400).send({
						message : "Karyawan Sudah Istirahat",
						transaction_sts : false,
						transaction_data : data_transaction,
						transaction_detail : getDetailTransaction
					});
				} else {
					res.send({
						message : "Karyawan Sedang Istirahat, Silahkan Klik Masuk Untuk Masuk Istirahat",
						transaction_sts : true,
						transaction_next_type : 0,
						emp_id : emp_data.nik,
						transaction_data : data_transaction,
						transaction_detail : getDetailTransaction
					});
				}
			}
		});

	});

};


function promiseGetTransactionDetailFromRestStatus(rest_status_transaction_id) {
	const detailTransactionPromise = new Promise((resolve, reject) => {
		TransaksiIstirahat.getDetailTransaksiById(
			rest_status_transaction_id, 
			(errDetailTransaction, dataDetailTransaction) => {
				if (errDetailTransaction) {
					reject(errDetailTransaction);
				} else {
					resolve(dataDetailTransaction);
				}
		});
	});
	
	return detailTransactionPromise;
}
const TransaksiIstirahat = require('../models/transaksi_kartu_istirahat.model.js');

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


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
	if (!req.params.emp_or_rfid) {
		res.status(400).send({
			message : "Data Tidak Boleh Kosong",
			transaction_sts : false
		})
		return;
	}

	let id_to_search_emp = req.params.emp_or_rfid;
	let rest_location_ip = req.ip;
	
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
			let ip_location = rest_location_ip.substr(7);

			if (errGetTransaction) {
				if (errGetTransaction.kind == "not_found") {
					// get card

					let card_to_use = await getRestCardForEmp(ip_location);

					res.send({
						transaction_sts : true,
						emp_id : emp_data.nik,
						transaction_next_type : 1,
						card_to_use : card_to_use,
						data_karyawan : dataEmp[0]
					})
				} else {
					res.status(500).send({
						message : "Error Ambil Data Transaksi Istirahat",
						transaction_sts : false
					});
				}				
			} else {
				let data_transaction = dataGetTransaction[0];
				let getDetailTransaction;

				getDetailTransaction = await promiseGetTransactionDetailFromRestStatus(data_transaction.id)
					.catch((errorDetailTransaction) => {
						return errorDetailTransaction;
					});

				/*
				try {
					getDetailTransaction = await promiseGetTransactionDetailFromRestStatus(data_transaction.id);	
				} catch (error) {
					getDetailTransaction = error;
				}*/
				

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
						transaction_detail : getDetailTransaction,
						data_karyawan : dataEmp[0]
					});
				}
			}
		});

	});

};

exports.setEmpRestTime = async (req, res) => {

	const transactionData = {};

	transactionData.nik = req.body.nik;
	transactionData.type_transaksi = req.body.type_trk;
	transactionData.transaction_status_id= req.body.id_trk;
	transactionData.id_kartu = req.body.id_kartu;
	transactionData.lokasi_istirahat = await promiseGetIdLocationByIpRaspberry(req.ip.substr(7)).catch((dataError) => {
		return "error";
	});

	if (
		transactionData.nik !== "" && 
		transactionData.type_transaksi !== "" && 
		transactionData.id_kartu !== "" && 
		transactionData.lokasi_istirahat !== "error") {
		
		TransaksiIstirahat.create(transactionData, (errInsertTransaction, dataInsertTransaction) => {
			if (errInsertTransaction) {
				res.status(500).send({
					message : "Error Input Transaksi",
					err : errInsertTransaction
				});
			} else {
				transactionData.rest_transaction_id = dataInsertTransaction.id;

				TransaksiIstirahat.insertRestStatus(
					transactionData, 
					async (errInsertStatusTransaction, dataInsertStatusTransaction) => {
						if (errInsertStatusTransaction) {
							res.status(500).send({
								message : "Error Insert Status Istirahat",
								err : errInsertStatusTransaction
							});

							//do del transaksi
						} else {
							let card_usage = await promiseChangeRestCardStatus(
								transactionData.id_kartu, 
								transactionData.type_transaksi)
								.catch((errorChangeStatus) => { return false; })
								.then((resultData) => { return true; });

							let calculate_duration = (
								transactionData.type_transaksi == 0 ? 
								await promiseCalculateDuration(dataInsertStatusTransaction.id_transaksi)
									.catch((errorDuration) => { return false; })
									.then((dataDuration) => { return true; }) : 
								"not_yet");
							
							let complete_transaction = (transactionData.type_transaksi == 0 ? 
							await promiseGetTransactionDetailFromRestStatus(dataInsertStatusTransaction.id_transaksi)
								.catch((errorDetailTransaction) => { return false; })
								.then((dataDetailTransaction) => { return dataDetailTransaction; }) : 
							"not_yet");

							res.send({
								status : "success",
								data : dataInsertStatusTransaction,
								status_tambahan : {
									card : card_usage,
									calculate : calculate_duration,
									detail : complete_transaction
								}
							});
						}
					});
			}
		});

	}else {
		res.status(400).send({
			message : "Data Tidak Boleh Kosong"
		})
	}
};


function promiseGetTransactionDetailFromRestStatus (rest_status_transaction_id) {
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

function promiseGetIdLocationByIpRaspberry (ip_address_client) {
	const detailDataLocationBasedOnIpAddress = new Promise((resolve, reject) => {
		Raspberry.getOneByIpAddress(ip_address_client, (errDetailLocation, dataDetailLocation) => {
			if (errDetailLocation) {
				reject(errDetailLocation);
			} else {
				resolve(dataDetailLocation);
			}
		});
	});
	return detailDataLocationBasedOnIpAddress;
}

function promiseGetAllCardAvailableByLocation (data_location) {
	const listAllAvailableCard = new Promise((resolve, reject) => {
		KartuIstirahat.getAllAvailableRestCardByLocationId(data_location, (errListCard, resListCard) => {
			if (errListCard) {
				reject(errListCard);
			} else {
				resolve(resListCard);
			}
		});
	});

	return listAllAvailableCard;
}

function promiseGetLatestTransactionByLocation (location_id) {
	const latestCard = new Promise((resolve, reject) => {
		TransaksiIstirahat.getLatestRestCardInTransactionByLocation(
			location_id, 
			(errLatestCard, resLatestCard) => {
				if (errLatestCard) {
					reject(errLatestCard);
				} else {
					resolve(resLatestCard);
				}
			});
	});

	return latestCard;
}

function promiseGetHighestCardByLocation (location_id) {
	const highestCard = new Promise((resolve, reject) => {
		KartuIstirahat.getLastCardByLocation(location_id, (errLastCard, resLastCard) => {
			if (errLastCard) {
				reject(errLastCard);
			} else {
				resolve(resLastCard);
			}
		});
	});
	return highestCard;
}

async function getRestCardForEmp (ip_location) {

	const resultCard = {};

	let listCard;
	let errorCollection = {};
	let location_detail = await promiseGetIdLocationByIpRaspberry(ip_location)
		.catch((errorCheckLocation) => {
			resultCard.errors = errorCheckLocation;
			resultCard.errors.step = "location";
		});
	console.log(resultCard);
	let highestCardInLocation = await promiseGetHighestCardByLocation(location_detail[0].id_sektor)
		.catch((errorHighestCard) => {
			resultCard.errors = errorHighestCard;
			resultCard.errors.step = "last_card";
		});
	
	//resultCard.success = highestCardInLocation;
	
	let lastTransaction = "not_found";
	try{
		lastTransaction = await promiseGetLatestTransactionByLocation(location_detail[0].id_sektor);
	}catch(errLastTransaction){
		if (errLastTransaction.kind == "not_found") {
			lastTransaction = "not_found";
		}
	}
	
	if (!resultCard.hasOwnProperty("errors")) {
		if (lastTransaction == "not_found") {
			listCard = await promiseGetAllCardAvailableByLocation({
				location_id : location_detail[0].id_sektor,
				id_used_card : 0
			});
	
			resultCard.card_avail_to_use = listCard[0];
		} else {
			if (lastTransaction[0].id_kartu == highestCardInLocation[0].id) {
				listCard = await promiseGetAllCardAvailableByLocation({
					location_id : location_detail[0].id_sektor,
					id_used_card : 0
				});
		
				resultCard.card_avail_to_use = listCard[0];
			} else {
				listCard = await promiseGetAllCardAvailableByLocation({
					location_id : location_detail[0].id_sektor,
					id_used_card : lastTransaction[0].id_kartu
				});
		
				resultCard.card_avail_to_use = listCard[0];
			}
		}
	}	
	return resultCard;
}

function promiseChangeRestCardStatus (card_id, card_status) {
	const resultChangeStatus = new Promise((resolve, reject) => {
		let cardData = {};
		cardData.idKartu = card_id;
		cardData.statusKartu = (card_status == 1 ? 0 : 1);
		console.log(cardData);
		KartuIstirahat.useUnuseCard(cardData, (errChangeStatus, dataChangeStatus) => {
			if(errChangeStatus) {
				reject(errChangeStatus);
			} else {
				resolve(dataChangeStatus);
			}
		});
	});

	return resultChangeStatus;
}

function promiseCalculateDuration (id_transaction) {
	const resultCalculateDuration = new Promise((resolve, reject) => {
		let dataToCalculate = {
			id_transaksi : id_transaction
		};
		TransaksiIstirahat.calculateRestDuration(dataToCalculate, (errCalculation, resultCalculation) => {
			if (errCalculation) {
				reject(errCalculation);
			} else {
				resolve(resultCalculation);
			}
		})
	})
	return resultCalculateDuration;
}
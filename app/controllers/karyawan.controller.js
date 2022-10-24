//karyawan.controller.js

const Karyawan = require("../models/karyawan.model.js");


exports.getOneByNik = (req, res) => {
	let emp_id = req.params.empId;

	Karyawan.getOneByNik(emp_id, (err, data) => {
		if (err) {
			console.log(err);
			res.status(500).send({
				message : "error"
			});
		} else res.send(data);
	});
};

exports.getNikEmpByRfid = (req, res) => {

	let rfid = "";

	if (!req.params.empRfid){
		res.status(400).send({
			message : "RFID Tidak Boleh Kosong"
		});
	} else {
		rfid = req.params.empRfid;
	}

	Karyawan.getEmpNikByRfid(rfid, (err, data) => {
		if (err) {
			res.status(500).send({
				message : "Terjadi Kesalahan"
			})	
		} else {
			res.send(data);
		}

	});

};
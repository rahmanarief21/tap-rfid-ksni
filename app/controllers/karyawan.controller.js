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
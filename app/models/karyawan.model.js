const sql = require("./db.js");

// tbl_karyawan & personal data

const Karyawan = (karyawan) => {
	this.nik = karyawan.nik;
	this.nama = karyawan.nama;
	this.jobtitle = karyawan.jobtitle;
	this.dept = karyawan.dept;
	this.costcenter = karyawan.costcenter;
	this.status = karyawan.status;
	this.pic = karyawan.pic;
};


Karyawan.getOneByNik = (emp_id, result) => {
	let querySql = `SELECT * FROM tbl_karyawan AS kry WHERE kry.nik = '${emp_id}'`;
	sql.query(querySql, (err, res) => {
		if (err) {
			console.log("error :", err);
			result(err, null);
			return;
		}

		result(null, res);
	});
};


module.exports = Karyawan;
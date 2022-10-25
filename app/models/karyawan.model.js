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
	let querySql = `SELECT kry.id, kry.nik, kry.nama, kry.dept, dept.nama_dept, kry.jobtitle, job.nama_jobtitle, kry.typek, tpk.nama_typek, kry.status, psd.card_id, kry.pic FROM tbl_karyawan AS kry LEFT JOIN tbl_dept AS dept ON kry.dept = dept.kode LEFT JOIN tbl_jobtitle AS job ON kry.jobtitle = job.kode LEFT JOIN tbl_typek as tpk ON kry.typek = tpk.kode LEFT JOIN tbl_personal_data as psd ON kry.nik = psd.nik WHERE psd.card_id=${emp_id} OR kry.nik = '${emp_id}'`;
	sql.query(querySql, (err, res) => {
		if (err) {
			console.log("error :", err);
			result(err, null);
			return;
		}

		if (res.length > 0) {
			result(null, res);
			return;
		}

		result({kind : "not_found"}, null)
	});
};


module.exports = Karyawan;
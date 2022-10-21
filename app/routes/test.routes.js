//test.routes.js

module.exports = app => {

	const Karyawan = require("../controllers/karyawan.controller.js");

	app.get("/api/karyawan/:empId", Karyawan.getOneByNik);

};
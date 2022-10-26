//test.routes.js

module.exports = app => {

	const Karyawan = require("../controllers/karyawan.controller.js");
	const Raspberry = require("../controllers/raspberry.controller.js");

	app.get("/api/karyawan/:empId", Karyawan.getOneByNik);

	app.get("/api/test2/:ip_address", Raspberry.getByIpAddress);
};
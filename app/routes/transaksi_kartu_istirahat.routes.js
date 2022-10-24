module.exports = app => {
	const TransaksiIstirahat =  require("../controllers/transaksi_kartu_istirahat.controller.js")

	app.post("/api/transaksi_kartu/", TransaksiIstirahat.createTransaction);

	app.get("/api/transaksi_kartu/", TransaksiIstirahat.getAllTransaction);

	app.get("/api/transaksi_kartu/:idTransaction", TransaksiIstirahat.getOneTransactionById);

	app.delete("/api/transaksi_kartu/:idTransaction", TransaksiIstirahat.deleteTransactionById);

	app.get("/api/status_istirahat/empid/:emp_id", TransaksiIstirahat.getStatusTransaksiByEmpId);

	app.post("/api/status_istirahat/calculate/", TransaksiIstirahat.setRestDuration);
};
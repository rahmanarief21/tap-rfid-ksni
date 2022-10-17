module.exports = app => {
	app.get("/", (req, res) => {
		res.send("API Kartu Istirahat & TAP RFID");
	});
};
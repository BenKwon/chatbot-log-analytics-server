const express = require("express");
const router = express.Router();
const loginLogController = require("../controller/loginLog-controller");

//get all logs
router.get("/", loginLogController.getLogs);

//get specific logs (filtered by name)
router.get("/name/:name", loginLogController.getLogsByName);

//get specific logs (filtered by userid)
router.get("/userid/:userid", loginLogController.getLogsById);

//get specific logs (filtered by date period)
router.get("/date/:start/:end", loginLogController.getLogsByDate);

module.exports = router;

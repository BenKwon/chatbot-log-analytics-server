const loginLogService = require("../service/loginLog-service");

//GET ALL LOGS
exports.getLogs  = async (req, res, next) => {
    const logs = await loginLogService.getLogs();
    res.json(logs);
};

//GET SPECIFIC LOGS FILTERED BY NAME
exports.getLogsByName = async (req, res, next) => {
    console.log(req.params);
    const logs = await loginLogService.getLogsByName(req.params.name);
    res.json(logs);
};

//GET SPECIFIC LOGS FILTERED BY ID
exports.getLogsById = async (req, res, next) => {
    console.log(req.params);
    const logs = await loginLogService.getLogsByName(req.params.userid);
    res.json(logs);
};

//GET SPECIFIC LOGS FILTERED BY DATE
exports.getLogsByDate = async (req, res, next) => {
    const logs = await loginLogService.getLogsByDate(req.params.start, req.params.end);
    res.json(logs);
};

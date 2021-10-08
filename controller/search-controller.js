const searchService = require("../service/search-service");

exports.getDialogs = async function(req, res ,next){
    const result = await searchService.getDialogs(req.query.dialogSessionId);
    res.status(201).json(result);
}
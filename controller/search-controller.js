const searchService = require("../service/search-service");

exports.getDialogs = async function(req, res ,next){
    try{
        const result = await searchService.getDialogs(req.query.dialogSessionId);
        if(result.Code) res.status(result.Code).json(result);
        res.status(201).json(result);
    }catch (error){
        res.status(500).json(error);
    }
}
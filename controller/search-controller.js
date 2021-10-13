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

exports.getCurrentCount = async function(req, res ,next){
    try{
        const result = await searchService.getCurrentCount();
        res.status(201).json(result.data);
    }catch (error){
        console.log(error);
    }
}

exports.getIdByCondition = async function(req, res ,next){
    try{
        console.log(req.query);
        const result = await searchService.getIdByCondition(req.query);
        res.status(201).json(result.data);
    }catch (error){
        console.log(error);
    }
}
exports.getTopSearched = async function (req, res, next) {
    const result =await searchService.getTopSearched();
    res.status(201).json(result);
};
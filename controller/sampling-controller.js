const samplingService = require("../service/sampling-service");

exports.getFirstIntents = async (req,res,next)=>{
    console.log("date",req.params.date);
    const data = await samplingService.getFirstIntents(req.params.date);
    res.status(201).json(data);
}

exports.getTopFiveIntents = async (req,res,next)=>{
    console.log("date",req.params.date);
    const data = await samplingService.getTopFiveIntents(req.params.date);
    res.status(201).json(data);
}

exports.getRecentIntents = async (req,res,next)=>{
    console.log("date",req.params.date);
    const data = await samplingService.getRecentIntents(req.params.date);
    res.status(201).json(data);
}
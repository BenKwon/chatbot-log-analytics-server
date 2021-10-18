const clusteringService = require('../service/clustering-service');

exports.getClustering = async (req,res,next)=>{
    const result = await clusteringService.getClustering(req.query);
    // console.log(req.query);
    res.status(201).json(result);
};

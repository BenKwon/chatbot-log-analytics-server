const express = require("express");
const router = express.Router();
const ClusteringController = require("../controller/clustering-controller");
router.get("/", ClusteringController.getClustering);
// router.get("/all/:date", SamplingController.getFirstIntents);
// router.get("/top5/:date", SamplingController.getTopFiveIntents);
// router.get("/recentIntent/:date", SamplingController.getRecentIntents);

module.exports = router;
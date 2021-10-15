const express = require("express");
const router = express.Router();
const SamplingController = require("../controller/sampling-controller");
// router.get("/:id", UserController.getUser);
router.get("/all/:date", SamplingController.getFirstIntents);
router.get("/top5/:date", SamplingController.getTopFiveIntents);


module.exports = router;
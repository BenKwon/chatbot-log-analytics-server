const express = require("express");
const router = express.Router();
const SamplingController = require("../controller/sampling-controller");
// router.get("/:id", UserController.getUser);
router.get("/all/:date", SamplingController.getFirstIntents);


module.exports = router;
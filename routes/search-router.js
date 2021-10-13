const express = require("express");
const router = express.Router();
const SearchController = require("../controller/search-controller");
// router.get("/:id", UserController.getUser);
router.get("/", SearchController.getDialogs);
router.get("/current-count",SearchController.getCurrentCount)
router.get("/condition", SearchController.getIdByCondition);
router.get("/top-searched", SearchController.getTopSearched);

module.exports = router;
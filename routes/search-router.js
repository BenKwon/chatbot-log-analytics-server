const express = require("express");
const router = express.Router();
const SearchController = require("../controller/search-controller");
// router.get("/:id", UserController.getUser);
router.get("/", SearchController.getDialogs);


module.exports = router;
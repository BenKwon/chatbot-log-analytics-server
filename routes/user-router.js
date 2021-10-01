const express = require("express");
const router = express.Router();
const UserController = require("../controller/user-controller");
// router.get("/:id", UserController.getUser);
router.get("/", UserController.getUsers);
// router.post("/", UserController.postUser);

module.exports = router;

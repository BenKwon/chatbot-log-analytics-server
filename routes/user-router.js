const express = require("express");
const router = express.Router();
const UserController = require("../controller/user-controller");
// router.get("/:id", UserController.getUser);
router.get("/", UserController.getUsers);
router.get("/count", UserController.getUsersCount);

router.delete("/", UserController.deleteUsers);
// router.post("/", UserController.postUser);
router.patch("/",UserController.patchUser);
module.exports = router;

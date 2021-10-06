const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

// router.get("/:id", UserController.getUser);
router.post("/", (req,res,next)=>{
    const authHeader = req.headers.token;
    if (authHeader) {
        //type Bearer
        const token = authHeader.split(" ")[1];
        console.log("token", token);
        let result
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if (err) {
                result ={
                    "result" : "fail",
                    "pass" : false,
                    "msg" : "Token is not valid"
                }
                res.status(201).json(result);
            }
            else {
                req.user = user;
                result = {
                    "result" : "success",
                    "msg" : "Token is valid",
                    "pass" : true
                }
                res.status(201).json(result);
            }
        });
    } else {
        result = {
            "result" : "fail",
            "msg" : "You are not authenticated",
            "pass" : false
        };
        return res.status(201).json(result);
    }
});

module.exports = router;

const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

// router.get("/:id", UserController.getUser);
router.post("/", (req,res,next)=>{
    const authHeader = req.headers.token;
    console.log(authHeader);
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
                res.status(403).json(result);
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
        return res.status(401).json("You are not authenticated");
    }
});

module.exports = router;

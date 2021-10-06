const router = require("express").Router();
const User = require("../models/User");
const LoginLog = require("../models/LoginLog");
const CryptoJS = require("crypto-js");
const fs = require("fs");
const jwt = require("jsonwebtoken");
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

// router.get("/login", (req, res, next) => {
//     if (req.session.user === undefined) {
//         fs.readFile('./public/login.html', (err, data) => {
//             res.end(data);
//         });
//     } else {
//         res.send(req.session.user.id);
//     }
//
// });

//LOGIN

router.post("/login", async (req, res) => {
    try {
        console.log("==========================================================================");
        //ip가져오기
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        let user = await User.findOne({userid: req.body.userid});
        //해당 유저가 없는 경우
        if (user === null) {
            res
                .json("There is no user whose name is " + req.body.userid);
            return;
        }

        //DB에서 가져온 이용자 패스워드 암호화 해제
        const decrypted = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const originPass = decrypted.toString(CryptoJS.enc.Utf8);
        //Failed to Login
        if (originPass !== req.body.password) {
            user["errorCode"] = 1005;
            res.status(401).json("Wrong Credentials");
        } else {//Success Login
            //세션 을 활용해서 로그인 처리하기
            // req.session.user = user;
            // req.session.save(err => {
            //     if (err) {
            //         console.log(err);
            //         throw err;
            //     }
            // })

            /**
             *  JWT를 이용해서 로그인 처리하기
             */
            console.log("user123123",user);

            const time = moment().format('YYYY-MM-DD HH:mm:ss');
            if (!user.initLoginAt && user.initLoginAt === "") {
                console.log("hi son");
                await User.updateOne({userid: user.userid}, {$set: {initLoginAt: time}});
            }
            await User.updateOne({userid: user.userid}, {$set: {currentLoginAt: time}});
            // 로그인 기록
            const newLoginLog = new LoginLog({
                "userid": user.userid,
                "username": user.username,
                "ip": ip,
                "loginAt": time,
                "department": user.department
            });
            const newLog = await newLoginLog.save();
            console.log(newLog);
            let {password, ...others} = user._doc;
            others.msg = "로그인 성공";
            console.log("user",user);
            const accessToken = jwt.sign({
                id: user._id,
                isAdmin: user.isAdmin,
            },process.env.JWT_SEC,{expiresIn: "1d"});
            res.status(200).json({others, accessToken});
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// router.get("/register", (req, res, next) => {
//     fs.readFile('./public/register.html', (err, data) => {
//         res.end(data);
//     });
// });

//REGISTER
router.post("/register", async (req, res) => {
    console.log("req body :  ", req.body);
    const newUser = new User({
        userid: req.body.userid,
        username: req.body.username,
        department: req.body.department,
        isAdmin: req.body.isAdmin,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString(),
    });
    try {
        const check = await User.find({"userid": newUser.userid});
        console.log("check", check.length);
        if (check.length > 0) {
            res.status(400).json({"errno": 1004, "msg": "userid already exist"});
        } else {
            const savedUser = await newUser.save();
            console.log(savedUser);
            res.status(201).json(savedUser);
        }

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


module.exports = router;

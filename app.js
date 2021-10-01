const express = require("express");
const cors = require('cors')
const session = require("express-session");
const dotenv = require("dotenv");
const FileStore = require("session-file-store")(session);
const connect = require("./db");
const morgan = require("morgan");
dotenv.config();
const app = express();

//SET PORT
app.set("port", process.env.PORT || 3003);
let corsOption = {
    origin: 'http://localhost:8080', // 허락하는 요청 주소
    methods: "GET,PUT,POST,DELETE",
    credentials: true // true로 하면 설정한 내용을 response 헤더에 추가 해줍니다.
};
app.use(cors(corsOption)); // CORS 미들웨어 추가

//USE SESSION
app.use(
    session({
        secret: process.env.SESS_SEC,
        resave: false,
        saveUninitialized: true,
        store: new FileStore(),
    })
);
// json & body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//mongodb connect
connect();
app.use(morgan('combined'));
//IMPORT ROUTERS
const authRouter = require("./routes/auth");
const userRouter = require("./routes/users");

app.get("/", (req,res)=>{
    res.send("success");
})
app.use("/auth", authRouter);
app.use("/users". userRouter);
app.listen(app.get("port"), () => {
    console.log(app.get("port"), "번 포트에서 대기 중");
});

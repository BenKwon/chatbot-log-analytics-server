const mongoose = require("mongoose");

const LoginLogSchema = new mongoose.Schema(
    {
        userid: { type: String, required: true },
        username: { type: String, required: true },
        ip : { type: String},
        loginAt:{ type : String, default: ""}
    }
    // { timestamps: true }\
);

module.exports = mongoose.model("LoginLog", LoginLogSchema);

const CryptoJS = require("crypto-js");
const LoginLog = require("../models/LoginLog");
const moment = require("moment");

exports.getLogs = async () => {
    let logs = await LoginLog.find();
    return logs;
};
exports.getLogsByName = async (name) => {
    let logs = await LoginLog.find({"username": name})
    return logs;
};
exports.getLogsById = async (id) => {
    let logs = await LoginLog.find({"userid": id})
    return logs;
};

exports.getLogsByDate = async (start, end) => {
    let date = new Date(end);
    date.setDate(date.getDate() + 1);
    date = moment(date).format('YYYY-MM-DD');
    console.log(date);
    let logs = await LoginLog.find({
        $and:
            [
                {"loginAt": {"$gte": start}},
                {"loginAt": {"$lte": date}}
            ]
    });
    return logs;
}
const CryptoJS = require("crypto-js");
const LoginLog = require("../models/LoginLog");
const moment = require("moment");
const User = require("../models/User");

exports.getLogs = async (query) => {
    try {
        if(!query.page) page = 1;
        let skip = (query.page - 1) * 10;
        let limit = 10;
        let start = query.startDate;
        let end = new Date(query.endDate);
        end.setDate(end.getDate() + 1);
        end = moment(end).format('YYYY-MM-DD');
        let logs;
        if (!query.keywordType) {
            logs = await LoginLog.find({
                $and:
                    [
                        {"loginAt": {"$gte": start}},
                        {"loginAt": {"$lte": end}}
                    ]
            }).skip(skip).limit(limit);
        } else {
            const keyword = query.keyword;
            if (query.keywordType == "name") {
                logs = await LoginLog.find({
                    $and:
                        [
                            {"loginAt": {"$gte": start}},
                            {"loginAt": {"$lte": end}},
                            {"username": keyword}
                        ]
                }).skip(skip).limit(limit);
            } else {
                logs = await LoginLog.find({
                    $and:
                        [
                            {"loginAt": {"$gte": start}},
                            {"loginAt": {"$lte": end}},
                            {"userid": keyword}
                        ]
                }).skip(skip).limit(limit);
            }
        }
        return logs;
    } catch (err) {
        console.log(err);
    }
};
// exports.getLogsByName = async (name) => {
//     let logs = await LoginLog.find({"username": name})
//     return logs;
// };
// exports.getLogsById = async (id) => {
//     let logs = await LoginLog.find({"userid": id})
//     return logs;
// };
//
// exports.getLogsByDate = async (start, end) => {
//     let date = new Date(end);
//     date.setDate(date.getDate() + 1);
//     date = moment(date).format('YYYY-MM-DD');
//     let logs = await LoginLog.find({
//         $and:
//             [
//                 {"loginAt": {"$gte": start}},
//                 {"loginAt": {"$lte": date}}
//             ]
//     });
//     return logs;
// }
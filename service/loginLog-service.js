const CryptoJS = require("crypto-js");
const LoginLog = require("../models/LoginLog");
const User = require("../models/User");
const moment = require("moment");
moment.tz.setDefault("Asia/Seoul");

exports.getLogs = async (query) => {
    try {
        if(!query.page) page = 1;
        let skip = (query.page - 1) * 10;
        let limit = 10;
        let start = query.startDate;
        let end = new Date(query.endDate);
        end.setDate(end.getDate() + 1);
        end = moment(end).format('YYYY-MM-DD');
        console.log(end);
        let logs,count;
        if (!query.keywordType) {
            count = (await LoginLog.find({
                $and:
                    [
                        {"loginAt": {"$gte": start}},
                        {"loginAt": {"$lte": end}}
                    ]
            })).length;
            logs = await LoginLog.find({
                $and:
                    [
                        {"loginAt": {"$gte": start}},
                        {"loginAt": {"$lte": end}}
                    ]
            }).skip(skip).limit(limit);
        } else {
            const keyword = query.keyword;
            console.log(query.keywordType);
            if (query.keywordType == "name") {
                count = (await LoginLog.find({
                    $and:
                        [
                            {"loginAt": {"$gte": start}},
                            {"loginAt": {"$lte": end}},
                            {"username": keyword}
                        ]
                })).length;
                logs = await LoginLog.find({
                    $and:
                        [
                            {"loginAt": {"$gte": start}},
                            {"loginAt": {"$lte": end}},
                            {"username": keyword}
                        ]
                }).skip(skip).limit(limit);
            } else {
                count = (await LoginLog.find({
                    $and:
                        [
                            {"loginAt": {"$gte": start}},
                            {"loginAt": {"$lte": end}},
                            {"userid": keyword}
                        ]
                })).length;
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
        logs = {"data" : logs, count};
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
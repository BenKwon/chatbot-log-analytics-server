const User = require("../models/User");
const CryptoJS = require("crypto-js");

exports.getUsersCount = () => {
    return User.estimatedDocumentCount();
};
exports.getUsers = async (page) => {
    if(!page) page = 1;
    let skip = (page - 1) * 10;
    let limit = 10;
    // const userList = await User.find().sort({"userid" : 1});
    let userList = await User.find().skip(skip).limit(limit).select("-password");
    return userList;
};

exports.deleteUsers = async (useridList) => {
    const userList = await User.deleteMany({
            userid: {$in: useridList},
        },
        function (err, rowsToDelete) {
            if (!err) {
                return rowsToDelete;
            } else {
                return err;
                console.log('Error in batch delete :' + err);
            }
        },);
    return userList;
};

exports.patchUser = async (user) => {
    user.password =  CryptoJS.AES.encrypt(
        user.password,
        process.env.PASS_SEC
    ).toString();
    const result =  await User.update({userid: user.userid},{ $set : user });
    console.log(result);
    return result;
};
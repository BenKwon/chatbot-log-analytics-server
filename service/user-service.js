const User = require("../models/User");
const CryptoJS = require("crypto-js");
exports.getUsers = async () => {
    const userList = await User.find().select("-password");
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
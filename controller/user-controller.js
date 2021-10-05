const UserService = require("../service/user-service");


//GET ALL USERS COUNT
exports.getUsersCount = async (req, res, next) => {
    const result = await UserService.getUsersCount();
    res.json(result);
};

//GET ALL USERS
exports.getUsers = async (req, res, next) => {
    console.log("page : ",req.query.page);
    const result = await UserService.getUsers(req.query.page);
    res.json(result);
};

//DELETE USERS (MORE THAN OR EQUAL ONE USER)
exports.deleteUsers = async (req, res, next) => {
    console.log("body",req.body);
    const result = await UserService.deleteUsers(req.body.checkedUsers);
    res.json(result);
};

//UPDATE USER INFO
exports.patchUser = async (req, res, next)=>{
    const result = await UserService.patchUser(req.body);
    res.json(result);
}

//     const result = await UserService.getUser(req.params.id);
//     console.log(result);
//     res.json(result);
// };

// exports.postUser = async (req, res, next) => {
//     const user = {
//         name: req.body.name,
//         age: req.body.age,
//         married: req.body.married,
//     };
//     const result = await UserService.postUser(user);
//     res.json(result);
// };

// router
// 	.get("/", async (req, res) => {
// 		console.log("here");

// 		const [userList, fields] = await w2pool.query("SELECT * FROM users");
// 		res.json(userList);
// 	})
// 	.get("/:id", async (req, res) => {
// 		const [userList, fields] = await pool.query(
// 			"SELECT * FROM users WHERE id = ? AND age > ?",
// 			[1, 2]
// 		);
// 		res.json(userList[0]);
// 	})
// 	.post("/", async (req, res, next) => {
// 		const [results, fields] = await pool.query(
// 			"INSERT INTO users(name,age,married) values (? , ?  , ?)",
// 			[req.body.name, req.body.age, req.body.married]
// 		);
// 		const result = req.body;
// 		result.id = results.insertId;
// 		res.status(201).json(result);
// 	});

// module.exports = router;

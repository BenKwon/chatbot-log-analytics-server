const UserService = require("../service/user-service");
// exports.getUser = async (req, res, next) => {
//     const result = await UserService.getUser(req.params.id);
//     console.log(result);
//     res.json(result);
// };

exports.getUsers = async (req, res, next) => {
    const result = await UserService.getUsers(req.params.id);
    res.json(result);
};

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

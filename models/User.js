const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
	{
		userid: { type: String, required: true, unique: true },
		username: { type: String, required: true },
		password: { type: String, required: true },
		department: { type: String},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		initLoginAt : { type: String, default: ""},
		currentLoginAt:{ type : String, default: ""}
	},
	// { timestamps: true }\
);

module.exports = mongoose.model("User", UserSchema);

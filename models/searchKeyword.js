const mongoose = require("mongoose");

const searchKeywordSchema = new mongoose.Schema(
    {
        keyword: { type: String, required: true },
        type : { type: String},
        searchedAt:{ type : String, default: ""},
    }
    // { timestamps: true }\
);

module.exports = mongoose.model("searchKeyword", searchKeywordSchema);

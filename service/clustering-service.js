const axios = require("axios");
const moment = require("moment");

exports.getClustering = async (query)=>{
    const result = await axios.get(`${process.env.API_URL}/analytics/intent-pattern`,{
        params: query,
        headers : {
            "CONAN-ACCESS-KEY" : process.env.API_ACCESS_KEY
        }
    });
    return result.data;
}

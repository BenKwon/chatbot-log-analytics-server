const axios = require("axios");

exports.getFirstIntents = async (date) => {
    console.log("url : ", `${process.env.API_URL}/sampling/all/${date}`);
    const result = await axios.get(`${process.env.API_URL}/sampling/all/${date}`, {
        headers: {
            "CONAN-ACCESS-KEY": process.env.API_ACCESS_KEY
        }
    });
    return result.data;
}

exports.getTopFiveIntents = async (date) => {
    console.log("url : ", `${process.env.API_URL}/sampling/all/${date}`);
    const result = await axios.get(`${process.env.API_URL}/sampling/intent/${date}`, {
        headers: {
            "CONAN-ACCESS-KEY": process.env.API_ACCESS_KEY
        }
    });
    return result.data;
}

exports.getRecentIntents = async (date) => {
    const result = await axios.get(`${process.env.API_URL}/trend/intent/${date}`, {
        headers: {
            "CONAN-ACCESS-KEY": process.env.API_ACCESS_KEY
        }
    });
    const tmp = result.data.map(function (o1) {
        let length = o1.Counts.length;
        let before = o1.Counts[length - 2].Count != 0 ? o1.Counts[length - 2].Count : 1;
        let after = o1.Counts[length-1].Count;
        let TotalCount = 0;
        for(let i = 0 ; i <o1.Counts.length ;i++){
            TotalCount += o1.Counts[i].Count;
        }
        let rate = ((after-before)/before)*100;
        o1.IncreaseRate = Math.floor(rate);
        o1.TotalCount = TotalCount;
        return o1;
    })
    tmp.sort(function(o1,o2){
        return o2.TotalCount -o1.TotalCount;
    })
    return tmp;
    // return result.data;
}

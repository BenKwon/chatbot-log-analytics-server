const axios = require("axios");
const PriorityQueue = require("js-priority-queue");
const moment = require("moment");
const searchKeyword = require("../models/searchKeyword");
/*
 * @param dialogSessionId
 * @returns {Promise<{keys: *[]}>}
 * @returns
 * {
 *   keys : [id1, id2, id3 ...],
 *   data : [
 *      [object array for id1],[object array for id2],[object array for id3],...
 *   ]
 *   ....
 * }
 * DialogSessionID 의 대화 내용을 조회한다
 *
 */
exports.getDialogs = async (dialogSessionId) => {
    try{
        let result = await axios.get(`${process.env.API_URL}/search`,
            {
                params : {
                    "dialog-session-id" : dialogSessionId
                },
                headers : {
                    "CONAN-ACCESS-KEY" : process.env.API_ACCESS_KEY
                }
            }
        );
        console.log("=========================================");
        let contents = result.data.Contents;
        /** 발화 ID 별로 나누기 **/
        let map = new Map();
        // Content를 Seq을 기준으로한 우선순위 큐 생성 함수
        const newPQ = ()=> {
            return new PriorityQueue({
                comparator : function(o1 ,o2){
                    return o1.Seq - o2.Seq;
                }
            });
        };
        //데이터 가공
        let making = {
            "keys" : [],
            "data" : []
        };
        for(let i = 0 ; i < contents.length;  i++){
            let content = contents[i];
            if(!map.get(content.DialogTransactionID)){
                making[content.DialogTransactionID] = [];
                making.keys.push(content.DialogTransactionID);
                map.set(content.DialogTransactionID,
                    newPQ()
                );
            }
            map.get(content.DialogTransactionID).queue(content);
        }
        const mapIter = map.keys();
        map.forEach((value, key, mapObject)=>{
            //발화ID
            let pq = value;
            while(pq.length > 0){
                let poll = pq.dequeue();
                if(poll.Entities != null){
                    poll.Entities = poll.Entities.filter(entity=> entity.ID.split("-")[0] === "CE");
                }
                making[key].push(poll);
            }
        });
        for(let i = 0 ; i < making.keys.length ; i++){
            let tmp = [];
            for(let j = 0 ; j < making[making.keys[i]].length ; j++){
                tmp.push(making[making.keys[i]][j]);
            }
            making.data.push(tmp);
        }
        result = {
            "size" : result.data.Size,
            "LoginAccessFrom" : result.data.LoginAccessFrom,
            "keys" : making.keys,
            "data" : making.data,
        };
        return result;
    }catch (error){
        console.log(error.response.data);
        return error.response.data;
        // return err;
    }
};

exports.getCurrentCount = async () => {
    const start = moment().add(-7,'d').format("YYYY-MM-DD");
    const end = moment().add(-1 , 'd').format("YYYY-MM-DD");
    try{
        const result = await axios.get(`${process.env.API_URL}/trend/dialog-session-id/${start}~${end}`,
            {
                headers : {
                    "CONAN-ACCESS-KEY" : process.env.API_ACCESS_KEY
                }
            }
        );
        return result;
    }catch(error){
        console.log(error);
    }
    // console.log(moment(time).add(-1,'d'));
}

//키워드 탭에서 검색
exports.getIdByCondition = async (params)=>{
    console.log(params);
    const time = moment().format('YYYY-MM-DD HH:mm:ss');
    if(params['intent-pattern']){ // delimiter -
        const pattern = params['intent-pattern'].split('-');
        for (let i = 0; i < pattern.length; i++) {
            if(pattern[i] != "*"){
                new searchKeyword({
                    "keyword" : pattern[i],
                    "type": "intent-pattern",
                    "searchedAt" : time
                }).save()
            }
        }
    }
    if(params.intent){ // delimiter ,
        const intent = params.intent.split('-');
        for (let i = 0; i < intent.length; i++) {
            new searchKeyword({
                "keyword" : intent[i],
                "type": "intent",
                "searchedAt" : time
            }).save()
        }
    }
    if(params.entity){ //delimiter
        const entity = params.entity.split('-');
        for (let i = 0; i < entity.length; i++) {
            await new searchKeyword({
                "keyword" : entity[i],
                "type": "entity",
                "searchedAt" : time
            }).save()
        }
    }
    try{
        const result = await axios.get(`${process.env.API_URL}/search`,{
            headers : {
                "CONAN-ACCESS-KEY" : process.env.API_ACCESS_KEY
            },
            params: params
        });
        console.log("result",result.data);
        return result;
    }catch(err){
        console.log("에러발생",err);
        return err;
    }

    console.log("data --------------",result.data);
}
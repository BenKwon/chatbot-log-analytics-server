const axios = require("axios");
const PriorityQueue = require("js-priority-queue");
const moment = require("moment");
const searchKeyword = require("../models/searchKeyword");
const LoginLog = require("../models/LoginLog");
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
/**
 * 최근 7일 데이터이여야 한다.
 * 인테트 타입별로 나누어애 한다.
 * 객체를 이용해서 타입별로 나누어진 결과에서 각 검색어별 갯수를 구한다*
 * 인텐트 타입별로 나누어서 나온 3가지의 검색어별 갯수를 합쳐서 내림차순한다.
 * @returns {Promise<void>}
 */
exports.getTopSearched = async ()=>{
    let start = new Date();
    start.setDate(start.getDate() - 7);
    let end = new Date();
    end.setDate(end.getDate() + 1);
    start = moment(start).format('YYYY-MM-DD');
    end = moment(end).format('YYYY-MM-DD');

    const intentPatternResult = await searchKeyword.find({
        $and:
            [
                {"searchedAt": {"$gte": start}},
                {"searchedAt": {"$lte": end}},
                {"type" : "intent-pattern"}
            ]
    });
    const intentResult = await searchKeyword.find({
        $and:
            [
                {"searchedAt": {"$gte": start}},
                {"searchedAt": {"$lte": end}},
                {"type" : "intent"}
            ]
    });
    const entityResult = await searchKeyword.find({
        $and:
            [
                {"searchedAt": {"$gte": start}},
                {"searchedAt": {"$lte": end}},
                {"type" : "entity"}
            ]
    });
    //인텐트 패턴
    let intentPatternTmp = {};
    for(let i = 0 ; i < intentPatternResult.length; i++){
        const result = intentPatternResult[i];
        if(intentPatternTmp[result.keyword]) intentPatternTmp[result.keyword]++;
        else intentPatternTmp[result.keyword] = 1;
    }
    let intentPattern = [];
    for (const [key, value] of Object.entries(intentPatternTmp)) {
        intentPattern.push({
            type : "intent-pattern",
            key,
            value
        })
    }

    //인텐트
    let intentTmp = {};
    for(let i = 0 ; i < intentResult.length; i++){
        const result = intentResult[i];
        if(intentTmp[result.keyword]) intentTmp[result.keyword]++;
        else intentTmp[result.keyword] = 1;
    }
    let intent = [];
    for (const [key, value] of Object.entries(intentTmp)) {
        intent.push({
            type : "intent",
            key,
            value
        })
    }


    //엔티티
    let entityTmp = {};
    for(let i = 0 ; i < entityResult.length; i++){
        const result = entityResult[i];
        if(entityTmp[result.keyword]) entityTmp[result.keyword]++;
        else entityTmp[result.keyword] = 1;
    }
    let entity = [];
    for (const [key, value] of Object.entries(entityTmp)) {
        entity.push({
            type : "entity",
            key,
            value
        })
    }

    let result = [
        ...intentPattern,
        ...intent,
        ...entity
    ]
    result.sort(function (o1, o2) {
        return o2.value - o1.value;
    });
    return result;
    // console.log(entityResult);
}
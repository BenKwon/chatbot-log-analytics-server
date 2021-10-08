const axios = require("axios");
const PriorityQueue = require("js-priority-queue");
/*
 * @param dialogSessionId
 * @returns {Promise<{keys: *[]}>}
 * @returns
 * {
 *   keys : [id1, id2, id3 ...],
 *   id1 : [Object], // Content Object
 *   id2 : [Object],
 *   id3 : [Object],
 *   ....
 * }
 * DialogSessionID 의 대화 내용을 조회한다
 *
 */
exports.getDialogs = async (dialogSessionId) => {
    try{
        let result = await axios.get(process.env.API_URL,
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
        console.log(contents);
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
                making[content.DialogTransactionID] = []
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
            "keys" : making.keys,
            "data" : making.data
        };
        return result;
    }catch (err){
        console.log(err)
    }
};

import request from "@/utils/request";

//发红包
const send = async (data) => {
    return await request.post('/api/red-packet/send', data);
}

//红包详情
const getDetail = async (id) => {
    return await request.get(`/api/red-packet/detail?id=${id}`);
}

//领取红包
const receive = async (id) => {
    return await request.post(`/api/red-packet/receive`, {id: id});
}

//红包领取记录
const getRecordList = async (id, page, limit) => {
    return await request.get(`/api/red-packet/record-list?id=${id}&page=${page}&limit=${limit}`);
}
export {
    send,
    getDetail,
    receive,
    getRecordList
};
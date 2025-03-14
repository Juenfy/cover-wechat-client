import { ref } from "vue";
import * as chatApi from "@/api/chat";
import * as messageApi from "@/api/message";
import {TypeImage, TypeText, TypeContent, ActionAt} from "@/enums/message";

export const chatInfo = ref({});
export const chatList = ref([]);
export const messageList = ref([]);
export const atMessageIdList = ref([]);
export const imagePreviewList = ref([]);

//获取聊天记录
export const getMessageList = (params, cb) => {
    messageApi.getList(params.to_user, params.is_group).then((res) => {
        console.log("getMessageList", res);
        if (res.code == 200001) {
            messageList.value = res.data;
            messageList.value.forEach((item) => {
                if (item.type === TypeImage) imagePreviewList.value.push(item.content);
                if (item.at_users.indexOf(params.from_user) != -1) {
                    atMessageIdList.value.push(item.id);
                }
            });
            cb(res);
        }
    });
};

//更新红包状态
export const updateRedPacketStatus = (msg, redPacketId) => {
    let status = 0;
    if (msg.indexOf("被领取") != -1) {
        status = -1;
    }
    if (msg.indexOf("已领取") != -1) {
        status = -2;
    }
    if (msg.indexOf("24小时") != -1) {
        status = -3;
    }
    if (msg.indexOf("无法领取") != -1) {
        status = -4;
    }
    if (msg.indexOf("手慢了") != -1) {
        status = -5;
    }
    messageList.value.forEach((item,index) => {
        if (item.red_packet_id == redPacketId) {
            messageList.value[index].red_packet.status = status;
        }
    });
}

//获取聊天信息
export const getChatInfo = (params, cb) => {
    chatApi.getInfo(params.to_user, params.is_group).then((res) => {
        console.log("getChatInfo", res);
        if (res.code == 200001) {
            chatInfo.value = res.data;
            cb(res);
        }
    });
}

//获取聊天列表
export const getChatList = () => {
    chatApi.getList().then((res) => {
        console.log("getChatList", res);
        chatList.value = sortChatList(res.data);
    });
};

//更新聊天信息
export const updateChat = (data, action) => {
    let res = false;
    let id = data.is_group == 1 ? data.to_user : data.from_user;
    chatList.value.forEach((item, index) => {
        if (item.is_group == data.is_group && item.to_user == id) {
            chatList.value[index].time = data.time;
            chatList.value[index].unread += 1;
            chatList.value[index].content = data.type != TypeText ? TypeContent[data.type] : data.content;
            if (data.is_group == 1) {
                chatList.value[index].content = data.from.nickname + "：" + chatList.value[index].content;
                if (action == ActionAt) {
                    chatList.value[index].content = "有人@你了";
                    chatList.value[index].at = true;
                }
            }
            res = true;
        }
    });
    if (!res) {
        getChatList();
    } else {
        chatList.value = sortChatList(chatList.value);
    }
    return res;
}

//聊天列表排序
export const sortChatList = (list) => {
    list.sort((a, b) => {
        if (a.top !== b.top) {
            return b.top - a.top;
        }
        return b.time - a.time;
    });
    return list;
};
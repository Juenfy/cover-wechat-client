import { ref } from "vue";
import * as chatApi from "@/api/chat";
import * as messageApi from "@/api/message";
import { TypeImage } from "@/enums/file";

export const chatInfo = ref({});
export const chatList = ref([]);
export const messageList = ref([]);
export const imagePreviewList = ref([]);
//获取聊天记录
export const getMessageList = async (params, cb) => {
    messageApi.getList(params.to_user, params.is_group).then((res) => {
        console.log("getMessageList", res);
        if (res.code == 200001) {
            imagePreviewList.value = [];
            messageList.value = res.data;
            messageList.value.forEach((item) => {
                if (item.type === TypeImage) imagePreviewList.value.push(item.content);
            });
            cb(res);
        }
    });
};

//获取聊天信息
export const getChatInfo = async (params, cb) => {
    chatApi.getInfo(params.to_user, params.is_group).then((res) => {
        console.log("getChatInfo", res);
        if (res.code == 200001) {
            chatInfo.value = res.data;
            cb(res);
        }
    });
}

//获取聊天列表
export const getChatList = async () => {
    chatApi.getList().then((res) => {
        console.log("getChatList", res);
        chatList.value = sortChatList(res.data);
    });
};

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
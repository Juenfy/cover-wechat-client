export class WebSocketClient {
  constructor(url, emitter) {
    this.url = url;
    this.emitter = emitter;
    this.websocket = null;
  }

  start(cb) {
    console.log(this.emitter);
    if ("WebSocket" in window) {
      console.log("当前浏览器支持 WebSocket");
      this.websocket = new WebSocket(this.url);
    } else if ("MozWebSocket" in window) {
      console.log("当前浏览器支持 MozWebSocket");
      this.websocket = new MozWebSocket(this.url);
    } else {
      alert("当前浏览器不支持 WebSocket");
    }
    if (this.websocket) {
      this.websocket.onopen = cb;
      this.websocket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log("收到消息", data);
        this.emitter.emit("onMessage", data);
      };

      this.websocket.onclose = (e) => {
        console.log("连接关闭", e);
      };
    }
  }

  stop() {
    if (this.websocket) {
      this.websocket.close();
    }
  }

  send(data) {
    if (this.websocket) {
      data = typeof data == "object" ? JSON.stringify(data) : data;
      console.log("发送消息", data);
      this.websocket.send(data);
    }
  }
}

export const startWebSocket = async (WebSocketClient, uid) => {
  WebSocketClient.start((e) => {
    console.log("连接成功", e);
    //登录成功 连接websocket
    const data = {
      who: "user",
      action: "login",
      data: { uid: uid },
    };
    WebSocketClient.send(data);
  });
};

import { ref } from "vue";
import * as chatApi from "@/api/chat";
import * as messageApi from "@/api/message";
import { TypeImage } from "@/enums/file";
import { CallAudio, CallVideo, StatusIncalling, StatusInwaiting, StatusIncoming } from "@/enums/call";
export const chatInfo = ref({});
export const chatList = ref([]);
export const messageList = ref([]);
export const imagePreviewList = ref([]);
export const momentList = ref([]);
export const showCommonCall = ref(false);
export const commonCallType = ref(CallVideo);
export const commonCallStatus = ref(StatusInwaiting);
export const callUser = ref({});
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

export const likeMoment = (data) => {
  momentList.value.forEach((item, index) => {
    if (item.id == data.moment_id) {
      momentList.value[index].likes.push(data);
      momentList.value[index].actions = [
        { text: '取消', value: 'unlike', icon: 'like' },
        { text: "评论", value: 'comment', icon: 'comment-o' },
      ];
    }
  });
}

export const unlikeMoment = (data) => {
  momentList.value.forEach((item, i) => {
    if (item.id == data.moment_id) {
      momentList.value[i].likes.forEach((like, j) => {
        if (like.id == data.like_id) {
          momentList.value[i].likes.splice(j, 1);
          momentList.value[i].actions = [
            { text: '赞', value: 'like', icon: 'like-0' },
            { text: "评论", value: 'comment', icon: 'comment-o' },
          ];
        }
      })
    }
  })
}

export const commentMoment = (data) => {
  momentList.value.forEach((item, i) => {
    if (item.id == data.moment_id) {
      momentList.value[i].comments.push(data);
    }
  })
}


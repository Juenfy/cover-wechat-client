<script setup>
import * as messageApi from "@/api/message";
import * as friendApi from "@/api/friend";
import { onMounted, watch, inject, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import CommonSearch from "@/components/common/search.vue";
import MessagePopup from "@/components/message/popup.vue";
import CommonCall from "@/components/common/call.vue";
import { useAppStore } from "@/stores/app";
import { useUserStore } from "@/stores/user";
import { SearchFriend, UnreadChat, UnreadApply, UnreadMoment } from "@/enums/app";
import { ActionApply, ActionSend, ActionLogout } from "@/enums/message";
import { ActionLike, ActionUnlike, ActionComment } from "@/enums/moment";
import { showDialog } from "vant";
import {
  startWebSocket,
  getChatList,
  messageList,
  imagePreviewList,
  likeMoment,
  unlikeMoment,
  commentMoment,
  showCommonCall,
  commonCallStatus,
  commonCallType,
  callUser
} from "@/utils/websocket";
import { TypeFile, TypeImage, Content } from "@/enums/file";
import { Text } from "@/enums/message";

const WebSocketClient = inject("WebSocketClient");
const route = useRoute();
const router = useRouter();
const emitter = inject("emitter");
const appStore = useAppStore();
const userStore = useUserStore();
const noticeAudio = inject("NoticeAudio");
const showMessagePopup = ref(false);

const message = ref({});
const messageAction = ref("");
const onSearch = (action, keywords, cb) => {
  console.log("action", action);
  switch (action) {
    case SearchFriend:
      friendApi.getSearchList(keywords).then((res) => {
        cb(res);
      });
      break;
  }
};
watch(
  () => userStore.isLogin,
  (val) => {
    if (val) {
      //登录成功 连接websocket
      startWebSocket(WebSocketClient, userStore.info.id);
      messageApi.getUnread().then((res) => {
        if (res.code == 200001) {
          appStore.setUnread(res.data);
        }
      });
    }
  }
);

//全局消息监听
const onMessage = async (data) => {
  console.log("App:onMessage", data);
  if (data?.action) {
    switch (data.action) {
      case ActionSend:
        let isGroup = data.data.is_group;
        let toUser = isGroup == 1 ? data.data.to_user : data.data.from.id;
        let currentPath = "/chat/message/" + toUser + "/" + isGroup;
        console.log(route.fullPath, currentPath);
        //在消息列表页面就刷新列表
        if (route.fullPath === "/chat" || route.fullPath === "/chat?verify=1") {
          await getChatList();
        }

        //不在聊天窗口或者消息列表页面就弹出消息气泡
        if (
          route.fullPath !== "/chat" &&
          route.fullPath !== "/chat?verify=1" &&
          route.fullPath !== currentPath
        ) {
          if (data.data.type !== Text)
            data.data.content = Content[data.data.type] ?? Content[TypeFile];
          message.value = data.data;
          showMessagePopup.value = true;
          messageAction.value = ActionSend;
        }

        // 当前聊天窗口，推进消息
        if (route.fullPath === currentPath) {
          messageList.value.push(data.data);
          if (data.data.type === Image)
            imagePreviewList.value.push(data.data.content);
          //立刻标记已读
          await messageApi.read({ to_user: toUser, is_group: isGroup });
        } else {
          //消息未读数加1
          appStore.unreadIncrBy(UnreadChat);
          //播放消息通知音
          await noticeAudio.play();
        }

        break;
      case ActionLogout:
        showDialog({
          title: "强制下线通知",
          message:
            "您的账号于" +
            data.data.time +
            "在其他地方登录，您已被强制下线，请重新登录。如果不是本人操作，请重新修改密码。",
        }).then(() => {
          router.push({ name: "login", query: { logout: 1 } });
        });
        break;
      case ActionApply:
        appStore.unreadIncrBy(UnreadApply);
        message.value = data.data;
        messageAction.value = ActionApply;
        showMessagePopup.value = true;
        break;
      case ActionLike:
        appStore.unreadIncrBy(UnreadMoment, 1, data.data.user);
        likeMoment(data.data);
        break;
      case ActionUnlike:
        unlikeMoment(data.data);
        break;
      case ActionComment:
        appStore.unreadIncrBy(UnreadMoment, 1, data.data.from);
        commentMoment(data.data);
    }
  }

};

onMounted(() => {
  console.log(emitter, WebSocketClient);
  //页面刷新 重新连接websocket
  if (userStore.isLogin) {
    startWebSocket(WebSocketClient, userStore.info.id);
  }
  console.log("emitter on onMessage");
  emitter.on("onMessage", onMessage);
});

onUnmounted(() => {
  console.log("emitter off onMessage");
  emitter.off("onMessage", onMessage);
});
</script>

<template>
  <van-config-provider :theme="appStore.theme">
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition ?? ''" mode="out-in">
        <keep-alive>
          <div :key="route.path" ref="">
            <component :is="Component" :key="route.path" />
          </div>
        </keep-alive>
      </transition>
    </router-view>
    <common-search :show="appStore.showCommonSearch" @hide="appStore.setShowCommonSearch(false)"
      :action="appStore.commonSearchAction" :placeholder="appStore.commonSearchPlaceholder" @search="onSearch" />
    <message-popup :show="showMessagePopup" @hide="showMessagePopup = false" :message="message"
      :action="messageAction" />
    <common-call :show="showCommonCall" :type="commonCallType" :status="commonCallStatus"
      :to="userStore.info"></common-call>
  </van-config-provider>
</template>

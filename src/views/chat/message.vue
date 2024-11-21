<!--聊天窗口页面-->
<script setup>
import { useRouter, useRoute } from "vue-router";
import {
  onMounted,
  ref,
  reactive,
  onUpdated,
  nextTick,
  watch,
} from "vue";
import "emoji-picker-element";
import * as messageApi from "@/api/message";
import { useAppStore } from "@/stores/app";
import { chatInfo, getChatInfo, messageList, getMessageList, imagePreviewList } from "@/utils/chat";
import { UnreadChat } from "@/enums/app";
import ChatInfo from "@/components/chat/info.vue";
import ChatGroupUsers from "@/components/chat/group/users.vue";
import {
  closeToast,
  showImagePreview,
  showLoadingToast,
} from "vant";
import * as fileApi from "@/api/file";
import { TypeFile, TypeImage, TypeVideo, TypeAudio } from "@/enums/file";
import { Text } from "@/enums/message";
import CommonComment from "@/components/common/comment.vue";

const uploadPercent = ref(0);
const router = useRouter();
const route = useRoute();
const appStore = useAppStore();
const atUsers = ref([]);
const content = ref("");
const contentRef = ref(null);
const msgBoxRef = ref(null);
const queryData = reactive({
  to_user: route.params.to_user,
  is_group: route.params.is_group,
});
const showChatInfo = ref(false);
const showChatGroupUsers = ref(false);

const handleInput = (data) => {
  // console.log("handleInput", data.value);
  content.value = data.value.content;
};

const onCommentCb = (data) => {
  console.log("onCommentCb", data.value);
  if (data.value.type == TypeFile) {
    uploadAndSendMessage(data.value.file.file, data.value.action == TypeAudio)
  }
  if (data.value.type == Text) {
    sendMessage(Text);
  }
};

//点击头像跳转主页
const onClickAvatar = (item) => {
  router.push({
    name: "friend-info",
    query: {
      keywords: item.from.wechat,
    },
  });
};

//选择at的用户回调
const selectAtUsers = (users) => {
  showChatGroupUsers.value = false;
  if (users.length <= 0) return false;
  console.log("选择艾特的用户", users);
  users.forEach((item) => {
    item.start = content.value.length;
    content.value += "@" + item.nickname + " ";
    item.end = content.value.length;
    atUsers.value.push(item);
  });
  console.log("最终艾特的用户", atUsers.value);
};

//监听消息变化
watch(content, (newVal, oldVal) => {
  if (
    chatInfo.value.is_group == 1 &&
    newVal.length > oldVal.length &&
    newVal.charAt(newVal.length - 1) === "@"
  ) {
    content.value = newVal.substring(0, newVal.length - 1);
    showChatGroupUsers.value = true;
  }
  //删除at用户处理
  if (atUsers.value.length > 0 && newVal.length < oldVal.length) {
    let lastAtUser = atUsers.value[atUsers.value.length - 1];
    let end = lastAtUser.end;
    let start = lastAtUser.start;
    if (end == oldVal.length) {
      content.value =
        content.value.slice(0, start) + content.value.slice(end + 1);
      atUsers.value.pop();
      console.log(atUsers.value);
    }
  }
});

//发送信息
const sendMessage = (type) => {
  if (content.value) {
    queryData.content = content.value;
    queryData.type = type;
    if (atUsers.value.length > 0) {
      const atUserIds = atUsers.value.map((item) => item.id);
      queryData.at_users = atUserIds.join(',');
    }
    messageApi.send(queryData).then((res) => {
      console.log("sendMessage", res);
      if (res.code == 200001) {
        messageList.value.push(res.data);
        if (res.data.type == TypeImage)
          imagePreviewList.value.push(res.data.content);
      }
    });
    content.value = "";
  }
};

const uploadAndSendMessage = (file, isAudio = false) => {
  const data = new FormData();
  if (isAudio) {
    data.append("file", file, "audio.wav");
  } else {
    data.append("file", file);
  }

  fileApi
    .upload(data, (progressEvent) => {
      uploadPercent.value = Math.floor(progressEvent.progress * 100);
      showLoadingToast(`上传中${uploadPercent.value}%`);
    })
    .then((res) => {
      console.log(res);
      if (res.code == 200001) {
        queryData.file_id = res.data.id;
        content.value = res.data.path;
        sendMessage(res.data.type);
      }
    })
    .finally(() => {
      closeToast(true);
    });
};

const previewImage = (url) => {
  let index = 0;
  imagePreviewList.value.forEach((v, i) => {
    if (v == url) index = i;
  });
  showImagePreview({
    images: imagePreviewList.value,
    startPosition: index,
  });
};

const onContentRightClick = (e) => {
  console.log("onContentRightClick", e);
};

onUpdated(() => {
  nextTick(() => {
    // 滚动到底部
    msgBoxRef.value.scrollTop = msgBoxRef.value.scrollHeight;
  });
});

onMounted(async () => {
  await getChatInfo(queryData, (res) => {
    if (res.data.unread > 0) {
      appStore.unreadDecrBy(UnreadChat, res.data.unread);
    }
  });
  await getMessageList(queryData, (res) => { });
});
</script>
<template>
  <div class="message-box">
    <header class="header-bottom-border">
      <van-nav-bar :title="chatInfo.nickname" left-arrow @click-left="router.go(-1)" @click-right="showChatInfo = true"
        :border="false" style="opacity: 0.9">
        <template #right>
          <van-icon name="ellipsis" size="20" />
        </template>
      </van-nav-bar>
    </header>
    <section class="bg-nav" :style="chatInfo.bg_file_path == ''
      ? ''
      : 'background-image: url(' + chatInfo.bg_file_path + ');'
      ">
      <div class="header"></div>
      <div class="container" ref="msgBoxRef" style="background: transparent">
        <ul class="message-list">
          <li v-for="item in messageList" :key="item.id" :class="item.is_tips == 1 ? 'li-tips-message' : ''">
            <div v-if="item.is_tips == 0" class="normal-message">
              <article :class="item.right ? 'right' : ''">
                <div class="avatar">
                  <img alt="avatar" :src="item.from.avatar" @click="onClickAvatar(item)" />
                </div>
                <div class="content" ref="contentRef" @click.exact.prevent="onContentRightClick">
                  <span :class="item.right ? 'nickname right' : 'nickname'" v-if="chatInfo.display_nickname">
                    {{ item.from.nickname }}
                  </span>
                  <div class="msg">
                    <div class="tri" v-if="[TypeVideo, TypeAudio].includes(item.type) === false"></div>
                    <div class="msg_inner" v-if="item.type == Text">
                      {{ item.content }}
                    </div>
                    <div class="msg_inner msg_image" v-else-if="item.type == TypeImage">
                      <van-image fit="contain" :src="item.content" @click="previewImage(item.content)" />
                    </div>
                    <div class="msg_inner msg_video" v-else-if="item.type == TypeVideo">
                      <div class="van-image">
                        <video controls :src="item.content" loop playsinline class="van-image__img"
                          style="object-fit: contain"></video>
                      </div>
                    </div>
                    <div class="msg_inner msg_audio" v-else-if="item.type == TypeAudio">
                      <div class="van-image">
                        <audio :src="item.content" controls type="audio/wav"></audio>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
            <div v-else class="tips-message">
              {{ item.content }}
            </div>
          </li>
        </ul>
      </div>
      <div class="footer">
        <common-comment :show="true" :content="content" @input="handleInput" @callback="onCommentCb"
          modules="emoji,more,record" placeholder="回车发送消息"></common-comment>
      </div>
    </section>
  </div>
  <chat-info :show="showChatInfo" @hide="showChatInfo = false" :info="chatInfo" />
  <chat-group-users v-if="chatInfo.is_group == 1" :show="showChatGroupUsers" @hide="showChatGroupUsers = false"
    @select="selectAtUsers" :users="chatInfo.users" />
</template>

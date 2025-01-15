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
  inject
} from "vue";
import * as messageApi from "@/api/message";
import { useAppStore } from "@/stores/app";
import { useUserStore } from "@/stores/user";
import { chatInfo, getChatInfo, messageList, atMessageIdList, getMessageList, imagePreviewList } from "@/utils/chat";
import { UnreadChat } from "@/enums/app";
import ChatInfo from "@/components/chat/info.vue";
import ChatGroupUsers from "@/components/chat/group/users.vue";
import {
  closeToast, showFailToast,
  showImagePreview,
  showLoadingToast,
} from "vant";
import * as fileApi from "@/api/file";
import {TypeFile, TypeImage, TypeVideo, TypeAudio, TypeVideoCall, TypeAudioCall, TypeRedPacket} from "@/enums/message";
import { TypeText } from "@/enums/message";
import CommonComment from "@/components/common/comment.vue";
import ChatRedPacketDetail from "@/components/chat/redPacket/detail.vue";
import { StatusName } from "@/enums/redPacket";


const sysAudio = inject("SysAudio");
const uploadPercent = ref(0);
const router = useRouter();
const route = useRoute();
const appStore = useAppStore();
const userStore = useUserStore();
const atUsers = ref([]);
const content = ref("");
const contentRef = ref(null);
const msgBoxRef = ref(null);
const queryData = reactive({
  from_user: userStore.info.id,
  to_user: route.params.to_user,
  is_group: route.params.is_group
});
const showChatInfo = ref(false);
const showChatGroupUsers = ref(false);
const messageItemRefs = ref([]);
const showRedPacketDetail = ref(false);
const redPacket = ref({});

// 设置消息的 ref
const setMessageItemRefs = (el, id) => {
  if (el) messageItemRefs.value[id] = el
  // console.log(messageItemRefs.value);
}

const handleInput = (data) => {
  // console.log("handleInput", data.value);
  content.value = data.value.content;
};

const onCommentCb = (data) => {
  console.log("onCommentCb", data.value);
  if (data.value.type == TypeFile) {
    uploadAndSendMessage(data.value.file.file, data.value.file?.options)
  }
  if (data.value.type == TypeRedPacket) {
    queryData.red_packet_id = data.value.red_packet_id;
  }
  if ([TypeText, TypeRedPacket].indexOf(data.value.type) !== -1) {
    sendMessage(data.value.type);
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
  if (content.value || queryData?.file_id > 0 || queryData?.red_packet_id > 0) {
    queryData.content = content.value;
    queryData.type = type;
    // console.log(atUsers.value);
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
    }).finally(() => {
      content.value = "";
      atUsers.value = [];
      queryData.at_users = "";
      queryData.file_id = 0;
      queryData.red_packet_id = 0;
    });
  }
};

const uploadAndSendMessage = (file, options) => {
  const data = new FormData();
  if (options) {
    data.append("file", file, options);
  } else {
    data.append("file", file);
  }

  fileApi
    .upload(data, (progressEvent) => {
      uploadPercent.value = Math.floor(progressEvent.progress * 100);
      showLoadingToast(`上传中${uploadPercent.value}%`);
    })
    .then((res) => {
      if (options == "audio.wav") sysAudio.chat.audio.play();
      if (res.code == 200001) {
        queryData.file_id = res.data.id;
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

// 查看@我的消息
const watchAtMessage = () => {
  if (atMessageIdList.value.length < 0) return false;
  const atMessageId = atMessageIdList.value.shift();
  const atMessage = messageItemRefs.value[atMessageId];
  const item = messageList.value.find(item => item.id == atMessageId);
  if (atMessage) {
    nextTick(() => {
      atMessage.scrollIntoView({
        behavior: 'smooth'
      });
      // 标记已读
      messageApi.read({
        is_group: item.is_group,
        to_user: item.to_user,
        id: item.id,
        type: 'at_users'
      }).then(res => {
        console.log(res);
      });
    });
  }
};

const onClickRedPacket = (data) => {
  if (data.length <= 0)
    return showFailToast("红包不存在");
  redPacket.value = data;
  showRedPacketDetail.value = true;
};

const onRightClick = (e) => {
  console.log(e);
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
          <li v-for="item in messageList" :key="item.id"
            :class="item.is_tips == 1 ? 'li-tips-message' : (item.right ? 'right' : '')"
            :ref="el => setMessageItemRefs(el, item.id)">
            <article v-if="item.is_tips == 0" class="normal-message">

              <div class="avatar">
                <img alt="avatar" :src="item.from.avatar" @click="onClickAvatar(item)" />
              </div>
              <div class="content" ref="contentRef" @contextmenu.prevent="onRightClick">
                <span :class="item.right ? 'nickname right' : 'nickname'" v-if="chatInfo.display_nickname">
                  {{ item.from.nickname }}
                </span>
                <div :class="'msg'+(' msg_'+item.type)+(item.type == TypeRedPacket && item.red_packet?.status != 1 ? ' red_packet_disabled' : '')">
                  <div class="tri"></div>
                  <div class="msg_inner" v-if="item.type == TypeText">
                    {{ item.content }}
                  </div>
                  <div class="msg_inner" v-else-if="[TypeAudioCall, TypeVideoCall].indexOf(item.type) !== -1">
                    <van-icon :name="item.type == TypeAudioCall ? 'phone-o' : 'video-o'" /> {{ item.content }}
                  </div>
                  <div class="msg_inner" v-else-if="item.type == TypeImage">
                    <van-image fit="contain" :src="item.content" @click="previewImage(item.content)" />
                  </div>
                  <div class="msg_inner" v-else-if="item.type == TypeVideo">
                    <div class="van-image">
                      <video controls :src="item.content" loop playsinline class="van-image__img"
                        style="object-fit: contain"></video>
                    </div>
                  </div>
                  <div class="msg_inner" v-else-if="item.type == TypeAudio">
                    <span v-if="item.right">6"&nbsp;</span><van-icon
                      :name="item.right ? '/volume-right.png' : '/volume.png'" style="margin-bottom: -2px;" /><span
                      v-if="!item.right">&nbsp;"6</span>
                    <!-- <div class="van-image">
                      <audio :src="item.content" controls type="audio/wav"></audio>
                    </div> -->
                  </div>
                  <div class="msg_inner" v-else-if="item.type == TypeFile">

                  </div>
                  <div class="msg_inner" v-else-if="item.type == TypeRedPacket" @click="onClickRedPacket(item.red_packet)">
                    <div class="top">
                      <van-icon name="/hb.png" size="35"/>
                      <div class="remark">
                        <h4>{{ item.content }}</h4>
                        <span v-if="item.red_packet.status != 1">{{ StatusName[item.red_packet.status] }}</span>
                        <span v-else>&nbsp;</span>
                      </div>
                    </div>
                    <div class="bottom">
                      微信红包
                    </div>

                  </div>
                </div>
              </div>
            </article>
            <div v-else class="tips-message">
              {{ item.content }}
            </div>
          </li>
        </ul>
        <van-badge :content="atMessageIdList.length" max="99" v-if="atMessageIdList.length > 0"
          class="message-tag message-tag-at">
          <van-tag type="warning" closeable round size="large" @click="watchAtMessage">有人@你了 </van-tag>
        </van-badge>
      </div>
      <div class="footer">
        <common-comment :show="true" :content="content" @input="handleInput" @callback="onCommentCb"
          modules="emoji,more,record" placeholder="回车发送消息" :group="route.params.is_group" :info="chatInfo"/>
      </div>
    </section>
  </div>
  <chat-info :show="showChatInfo" @hide="showChatInfo = false" :info="chatInfo" />
  <chat-group-users v-if="chatInfo.is_group == 1" :show="showChatGroupUsers" @hide="showChatGroupUsers = false"
    @select="selectAtUsers" :users="chatInfo.users" />
  <chat-red-packet-detail :show="showRedPacketDetail" :redPacket="redPacket" @hide="showRedPacketDetail = false"/>
</template>

<style lang="less">
.message-tag {
  position: fixed !important;
  right: 1rem;
}

.message-tag-at {
  bottom: 6rem;
}

.message-tag-quote {
  bottom: 7rem;
}
</style>
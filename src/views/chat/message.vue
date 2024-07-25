<!--聊天窗口页面-->
<script setup>
import { useRouter, useRoute } from "vue-router";
import {
  onMounted,
  onUnmounted,
  ref,
  reactive,
  onUpdated,
  nextTick,
  onBeforeUnmount,
} from "vue";
import "emoji-picker-element";
import * as messageApi from "@/api/message";
import * as chatApi from "@/api/chat";
import { useAppStore } from "@/stores/app";
import { messageList, imagePreviewList } from "@/utils/websocket";
import { UnreadChat } from "@/enums/app";
import ChatInfo from "@/components/chat/info.vue";
import {
  closeToast,
  showFailToast,
  showImagePreview,
  showLoadingToast,
} from "vant";
import * as fileApi from "@/api/file";
import { File, Image, Video, Audio as AudioEnum } from "@/enums/file";
import { Text } from "@/enums/message";

const uploadPercent = ref(0);
const uploadMaxSize = ref(30 * 1024 * 1024);
const router = useRouter();
const route = useRoute();
const appStore = useAppStore();
const popupMoreBottom = ref(false);
const popupEmojiBottom = ref(false);
const content = ref("");
const input = ref(null);
const chatInfo = ref({});
const msgBoxRef = ref(null);
const footerRef = ref(null);
const queryData = reactive({
  to_user: route.params.to_user,
  is_group: route.params.is_group,
});
const showChatInfo = ref(false);
const moreBottomAction = ref("");
const audioIcon = "/audio.png";
const keyboardIcon = "/keyboard.png";
const emojiIcon = "/emoji.png";
const leftIcon = ref(audioIcon);
const rightFirstIcon = ref(emojiIcon);
const isAudioRecord = ref(false);
const isAudioRecording = ref(false);
const isCancelAudioRecording = ref(false);
const mediaRecorder = ref(null);
const audioChunks = ref([]);
const mediaStream = ref(null);
const startY = ref(0);
const waveOffset = ref(0);
const animationFrame = ref(null);

//底部图标点击交互
const handleLeftIconClick = (e) => {
  popupEmojiBottom.value = false;
  popupMoreBottom.value = false;
  isAudioRecord.value = !isAudioRecord.value;
  if (isAudioRecord.value) {
    leftIcon.value = keyboardIcon;
  } else {
    leftIcon.value = audioIcon;
  }
};

const handleRightSecondIconClick = (e) => {
  popupEmojiBottom.value = false;
  setTimeout(() => {
    popupMoreBottom.value = !popupMoreBottom.value;
    if (popupMoreBottom.value) {
      isAudioRecord.value = false;
      leftIcon.value = audioIcon;
    }
  }, 200);
};

const handleRightFirstIconClick = (e) => {
  popupMoreBottom.value = false;
  setTimeout(() => {
    popupEmojiBottom.value = !popupEmojiBottom.value;
    if (popupEmojiBottom.value) {
      isAudioRecord.value = false;
      leftIcon.value = audioIcon;
    }
  }, 100);
};

const onSelectEmoji = (emoji) => {
  content.value += emoji.detail.unicode;
  input.value.focus();
};

const onMoreBottomItemClick = (action) => {
  moreBottomAction.value = action;
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

//发送信息
const sendMessage = (type) => {
  if (content.value) {
    queryData.content = content.value;
    queryData.type = type;
    messageApi.send(queryData).then((res) => {
      console.log("sendMessage", res);
      if (res.code == 200001) {
        messageList.value.push(res.data);
        if (res.data.type == Image)
          imagePreviewList.value.push(res.data.content);
      }
    });

    content.value = "";
  }
};

const readMessage = async () => {
  if (queryData.to_user) {
    messageApi.read(queryData).then((res) => {
      console.log("readMessage", res);
      if (res.code == 200001) {
        appStore.unreadDecrBy(UnreadChat, chatInfo.value.unread);
      }
    });
  }
};

const getMessageList = async () => {
  messageApi.getList(queryData.to_user, queryData.is_group).then((res) => {
    console.log("getMessageList", res);
    if (res.code == 200001) {
      messageList.value = res.data;
      messageList.value.forEach((item) => {
        if (item.type == Image) imagePreviewList.value.push(item.content);
      });
    }
  });
};

const getChatInfo = async () => {
  chatApi.getInfo(queryData.to_user, queryData.is_group).then((res) => {
    console.log("getChatInfo", res);
    if (res.code == 200001) {
      chatInfo.value = res.data;
    }
  });
};

const onOversize = (file) => {
  showFailToast("文件大小超过30MB限制");
};

const beforeRead = (file) => {
  switch (moreBottomAction.value) {
    case "photo":
      if (file.type.startsWith("video/") || file.type.startsWith("image/")) {
        return true;
      }
      showFailToast("请选择一个图片或视频文件");
      return false;
      break;
  }
};

const afterRead = (file) => {
  uploadAndSendMessage(file.file);
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

//录音
const animateWave = () => {
  waveOffset.value = (waveOffset.value + 1) % 100;
  animationFrame.value = requestAnimationFrame(animateWave);
};

const wavePath = (n) => {
  const amplitude = 10;
  const frequency = 0.1;
  let path = "M 0 15 ";
  for (let x = 0; x <= 100; x++) {
    const y =
      15 + amplitude * Math.sin(frequency * (x + waveOffset.value + n * 20));
    path += `L ${x} ${y} `;
  }
  return path;
};

const startRecording = (e) => {
  console.log("开始录音", e);
  startY.value = e.touches[0].clientY;
  console.log(startY.value);
  isAudioRecording.value = true;
  isCancelAudioRecording.value = false;
  audioChunks.value = [];
  if (mediaRecorder.value) {
    mediaRecorder.value.start();
  }
  animationFrame.value = requestAnimationFrame(animateWave);
};

const stopRecording = (e) => {
  if (mediaRecorder.value && isAudioRecording.value) {
    mediaRecorder.value.stop();
    console.log(isCancelAudioRecording.value ? "取消录音" : "停止录音", e);
  }
  isAudioRecording.value = false;

  cancelAnimationFrame(animationFrame.value);
};

const handleTouchMove = (e) => {
  // console.log("touchmove", e);
  const currentY = e.touches[0].clientY;
  console.log(currentY);
  if (startY.value - currentY > 100) {
    // 上划距离超过50像素
    isCancelAudioRecording.value = true;
  } else {
    isCancelAudioRecording.value = false;
  }
};

onUpdated(() => {
  nextTick(() => {
    // 滚动到底部
    msgBoxRef.value.scrollTop = msgBoxRef.value.scrollHeight;
  });
});

onBeforeUnmount(() => {
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value);
  }
});

onMounted(async () => {
  try {
    mediaStream.value = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    mediaRecorder.value = new MediaRecorder(mediaStream.value);

    mediaRecorder.value.ondataavailable = (event) => {
      audioChunks.value.push(event.data);
    };

    mediaRecorder.value.onstop = () => {
      const audioBlob = new Blob(audioChunks.value, { type: "audio/wav" });
      audioChunks.value = [];
      if (!isCancelAudioRecording.value) {
        // 这里可以上传录音文件或进行其他处理
        console.log("录音文件:", audioBlob);
        uploadAndSendMessage(audioBlob, true);
      }
    };
  } catch (error) {
    console.error("获取音频权限失败:", error);
  }
  await getChatInfo();
  await getMessageList();
});

onUnmounted(async () => {
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach((track) => track.stop());
  }
  await readMessage();
});
</script>
<template>
  <div class="message-box">
    <header>
      <van-nav-bar
        :title="chatInfo.nickname"
        left-arrow
        @click-left="router.go(-1)"
        @click-right="showChatInfo = true"
        style="
          box-sizing: border-box;
          border-bottom: 0.1rem solid var(--van-nav-bar-border-color);
        "
      >
        <template #right>
          <van-icon name="ellipsis" size="20" color="#191919" />
        </template>
      </van-nav-bar>
    </header>
    <section
      class="bg-nav"
      :style="
        chatInfo.bg_file_path == ''
          ? ''
          : 'background-image: url(' + chatInfo.bg_file_path + ');'
      "
    >
      <div class="header"></div>
      <div class="container" ref="msgBoxRef">
        <ul class="message-list">
          <li
            v-for="item in messageList"
            :key="item.id"
            :class="item.is_tips == 1 ? 'li-tips-message' : ''"
          >
            <div v-if="item.is_tips == 0" class="normal-message">
              <article :class="item.right ? 'right' : ''">
                <div class="avatar">
                  <img
                    alt="avatar"
                    :src="item.from.avatar"
                    @click="onClickAvatar(item)"
                  />
                </div>
                <div class="content">
                  <span
                    :class="item.right ? 'nickname right' : 'nickname'"
                    v-if="chatInfo.display_nickname"
                  >
                    {{ item.from.nickname }}
                  </span>
                  <div class="msg">
                    <div class="tri"></div>
                    <div class="msg_inner" v-if="item.type == Text">
                      {{ item.content }}
                    </div>
                    <div
                      class="msg_inner msg_image"
                      v-else-if="item.type == Image"
                    >
                      <van-image
                        fit="contain"
                        :src="item.content"
                        @click="previewImage(item.content)"
                      />
                    </div>
                    <div
                      class="msg_innser msg_video"
                      v-else-if="item.type == Video"
                    >
                      <div class="van-image">
                        <video
                          controls
                          :src="item.content"
                          loop
                          playsinline
                          class="van-image__img"
                          style="object-fit: contain"
                        ></video>
                      </div>
                    </div>
                    <div
                      class="msg_innser msg_audio"
                      v-else-if="item.type == AudioEnum"
                    >
                      <div class="van-image">
                        <audio
                          :src="item.content"
                          controls
                          type="audio/wav"
                        ></audio>
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
      <div class="footer" ref="footerRef">
        <div class="msg-box-top">
          <div class="left">
            <van-icon :name="leftIcon" @click="handleLeftIconClick" />
          </div>
          <van-button
            v-if="isAudioRecord"
            type="primary"
            @touchstart="startRecording"
            @touchend="stopRecording"
            @touchmove="handleTouchMove"
            >按住说话</van-button
          >
          <input
            v-else
            type="text"
            v-model="content"
            @keyup.enter="sendMessage('text')"
            ref="input"
          />
          <div class="right">
            <van-icon
              :name="rightFirstIcon"
              @click="handleRightFirstIconClick"
            />
            <van-icon name="/more.png" @click="handleRightSecondIconClick" />
          </div>
        </div>
        <div
          :class="
            popupMoreBottom ? 'more-bottom more-bottom-popup' : 'more-bottom'
          "
        >
          <van-grid
            :column-num="4"
            style="width: inherit"
            gutter="1rem"
            square
            center
            :border="false"
          >
            <van-grid-item>
              <template #default>
                <van-uploader
                  :before-read="beforeRead"
                  :after-read="afterRead"
                  accept="image/*, video/*"
                  :max-size="uploadMaxSize"
                  @oversize="onOversize"
                  max-count="1"
                  @click="onMoreBottomItemClick('photo')"
                >
                  <div class="more-bottom-item">
                    <div class="more-bottom-icon">
                      <van-icon name="photo" size="30"></van-icon>
                    </div>
                    <span class="more-bottom-text">照片</span>
                  </div>
                </van-uploader>
              </template>
            </van-grid-item>
            <van-grid-item>
              <template #default>
                <div class="more-bottom-item">
                  <div class="more-bottom-icon">
                    <van-icon name="photograph" size="30" />
                  </div>
                  <span class="more-bottom-text">拍摄</span>
                </div>
              </template>
            </van-grid-item>
            <van-grid-item>
              <template #default>
                <van-uploader
                  :max-size="uploadMaxSize"
                  @oversize="onOversize"
                  @click="onMoreBottomItemClick('file')"
                  max-count="1"
                >
                  <div class="more-bottom-item">
                    <div class="more-bottom-icon">
                      <van-icon name="description" size="30" />
                    </div>
                    <span class="more-bottom-text">文件</span>
                  </div>
                </van-uploader>
              </template>
            </van-grid-item>
          </van-grid>
        </div>
        <emoji-picker
          :class="
            popupEmojiBottom
              ? 'emoji-bottom emoji-bottom-popup'
              : 'emoji-bottom'
          "
          @emojiClick="onSelectEmoji"
        />
      </div>
    </section>
  </div>
  <chat-info
    :show="showChatInfo"
    @hide="showChatInfo = false"
    :info="chatInfo"
  />

  <div class="audio-recording" v-if="isAudioRecording">
    <div :class="isCancelAudioRecording ? 'bubble bubble-cancel' : 'bubble'">
      <svg
        class="waveform"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 30"
      >
        <path
          v-for="n in 5"
          :key="n"
          :d="wavePath(n)"
          stroke="white"
          stroke-width="2"
          fill="none"
          :opacity="1 - n * 0.15"
        />
      </svg>
    </div>
    <div class="recording-text">
      {{
        isCancelAudioRecording ? "松开手指，取消发送" : "正在录音... 上划取消"
      }}
    </div>
  </div>
</template>
<style scoped lang="less">
.message-box {
  section {
    // background-image: url(/src/assets/bg.png);
    background-position: center;
    background-size: cover;
    .container {
      .message-list {
        padding: 0.5rem 1rem 0 1rem;
        > li {
          display: block;
        }
        > li > .normal-message > article {
          display: flex;
          justify-content: flex-start;
          margin-bottom: 0.5rem;
          > .avatar {
            margin-right: 0.7rem;
            > img {
              width: 3.5rem;
              height: 3.5rem;
              border-radius: 0.2rem;
            }
          }
          > .content > span {
            color: var(--theme-text-color-tint);
            font-size: 14px;
            line-height: 18px;
            display: block;
          }
          > .content > .right {
            text-align: right;
          }
          > .content > .msg {
            display: flex;
            justify-content: space-between;
            > .tri {
              width: 0;
              height: 0;
              border-style: solid;
              border-width: 0 0.8rem 1rem 0;
              border-color: transparent #ffffff transparent transparent;
            }
            > .msg_inner {
              background-color: #fff;
              width: 100%;
              padding: 1rem 0.7rem;
              border-radius: 0 0.2rem 0.2rem 0.2rem;
              box-shadow: 0.1rem 0.1rem 0.2rem rgba(0, 0, 0, 0.1);
              text-align: left;
              word-wrap: break-word; /* 在单词的任意位置断行 */
              word-break: break-all; /* 在单词的任意位置断行 */
            }
          }
        }

        > li > .normal-message > article.right {
          flex-direction: row-reverse;
          > .avatar {
            margin-right: 0px;
            margin-left: 0.7rem;
          }
          > .content > .msg {
            flex-direction: row-reverse;
            > .tri {
              width: 0;
              height: 0;
              border-style: solid;
              border-width: 1rem 0.7rem 0 0;
              border-color: #98e865 transparent transparent transparent;
            }

            > .msg_inner {
              border-radius: 0.2rem 0 0.2rem 0.2rem;
              background-color: #98e865;
            }
          }
        }
        > li.li-tips-message {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 1rem;
        }
        > li > .tips-message {
          width: 60%;
          text-align: center;
          font-size: 12px;
          line-height: 2rem;
          color: var(--theme-text-color);
          background-color: #f6f6f6;
          opacity: 0.8;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
          border-radius: 4px;
        }
      }
    }
    .footer {
      height: auto;
      > div {
        width: inherit;
        padding: 1rem 0;
        background-color: #f6f6f6;
        display: flex;
        border-top: 1px solid var(--van-nav-bar-border-color);
      }
      > .msg-box-top {
        border-top: none;
        > input,
        button {
          background-color: var(--van-white);
          border: none;
          outline: none;
          height: 34px;
          width: 75%;
          border-radius: 0.2rem;
          color: var(--van-black);
        }
        > input {
          padding: 0;
          text-indent: 10px;
        }
        > .left,
        > .right {
          height: inherit;
          font-size: 24px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        > .left {
          width: 10%;
        }
        > .right {
          width: 15%;
          justify-content: space-evenly;
        }
      }
      > .more-bottom,
      > .emoji-bottom {
        padding: 0;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.2s ease-in-out;
        .more-bottom-item {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          .more-bottom-icon {
            height: 4rem;
            width: 4rem;
            background: var(--van-white);
            border-radius: 0.8rem;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .more-bottom-text {
            margin-top: 5px;
            font-size: 12px;
            color: var(--theme-text-color-tint);
          }
        }
      }
      > .more-bottom-popup,
      > .emoji-bottom-popup {
        max-height: 18rem;
      }
      > .more-bottom-popup {
        padding: 1rem 0;
      }
      emoji-picker {
        width: inherit;
        height: 18rem;
        --background: #f6f6f6;
      }
    }
  }
}
</style>

<style lang="css">
:root:root {
  --van-grid-item-content-background: transparent;
}

.audio-recording {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.5);
}

.bubble {
  position: relative;
  background-color: var(--theme-main-color);
  padding: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bubble::before {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid var(--theme-main-color);
}

.bubble-cancel {
  background-color: var(--theme-danger-color);
}

.bubble-cancel::before {
  border-top: 10px solid var(--theme-danger-color);
}

.waveform {
  width: 100px;
  height: 30px;
}

.recording-text {
  font-size: 16px;
  font-weight: bold;
  color: var(--theme-text-color-tint);
}
</style>

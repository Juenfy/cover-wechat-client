<script setup>
import { onMounted, onUnmounted, onBeforeUnmount, ref, watch, nextTick } from 'vue';
import { useAppStore } from "@/stores/app";
import { showFailToast } from 'vant';
import {TypeVideoCall, TypeAudioCall, TypeFile, TypeAudio, TypeRedPacket} from "@/enums/message";
import { startCall } from "@/utils/call";
import "emoji-picker-element";
import {WechatCamera} from "vue-wechat-camera"
import "vue-wechat-camera/dist/vue-wechat-camera.css"
import ChatRedPacketForm from "@/components/chat/redPacket/form.vue"

const props = defineProps({
    modules: String,
    content: String,
    position: String,
    show: Boolean,
    placeholder: String,
    group: String,
    info: Object
});

const emit = defineEmits(['callback', 'input', 'hide']);

const appStore = useAppStore();
const input = ref({
    content: '',
    red_packet_id: 0,
    file: null,
    type: 'text',
    action: ''
});
const isFirstClick = ref(true);
const textareaRef = ref(null);
const uploadMaxSize = ref(30 * 1024 * 1024);
const recordIcon = ref(appStore.icon.audio);
const isAudioRecord = ref(false);
const isAudioRecording = ref(false);
const isCancelAudioRecording = ref(false);
const mediaRecorder = ref(null);
const recorderInterval = ref(null);
const audioDuration = ref(0);
const audioChunks = ref([]);
const mediaStream = ref(null);
const startY = ref(0);
const waveOffset = ref(0);
const animationFrame = ref(null);
const showEmojiPopup = ref(false);
const showMorePopup = ref(false);
const commentRef = ref(null);
const showCallMenu = ref(false);
const callActions = [
    { name: "视频通话", value: TypeVideoCall },
    { name: "语音通话", value: TypeAudioCall }
];
const openCamera = ref(false);
const showRedPacketForm = ref(false);

const onSelectCallAction = (action) => {
    switch (action.value) {
        case TypeVideoCall:
            startCall(TypeVideoCall);
            break;
        case TypeAudioCall:
            startCall(TypeAudioCall);
            break;
    }
};

const handleKeyupEnter = () => {
    input.value.action = 'input';
    input.value.file = null;
    input.value.red_packet_id = 0;
    input.value.type = 'text';
    emit('callback', input);
};

const handleRecordIconClick = () => {
    showEmojiPopup.value = false;
    showMorePopup.value = false;
    isAudioRecord.value = !isAudioRecord.value;
    if (isAudioRecord.value) {
        recordIcon.value = appStore.icon.keyboard;
    } else {
        recordIcon.value = appStore.icon.audio;
    }
}

const handleEmojiIconClick = () => {
    if (showMorePopup.value) {
        showMorePopup.value = false;
        setTimeout(() => {
            showEmojiPopup.value = !showEmojiPopup.value;
            if (showEmojiPopup.value) {
                isAudioRecord.value = false;
                recordIcon.value = appStore.icon.audio;
            }
        }, 200);
    } else {
        showEmojiPopup.value = !showEmojiPopup.value;
    }
}

const handleMoreIconClick = () => {
    if (showEmojiPopup.value) {
        showEmojiPopup.value = false;
        setTimeout(() => {
            showMorePopup.value = !showMorePopup.value;
            if (showMorePopup.value) {
                isAudioRecord.value = false;
                recordIcon.value = appStore.icon.audio;
            }
        }, 200);
    } else {
        showMorePopup.value = !showMorePopup.value;
    }
}

const onMoreBottomItemClick = (action) => {
    input.value.action = action;
    if (action == 'camera') {
      showMorePopup.value = false;
      openCamera.value = true;
    }
}

const handleInput = () => {
    emit('input', input);
};
//选择表情包
const onSelectEmoji = (emoji) => {
    input.value.content += emoji.detail.unicode;
    textareaRef.value.focus();
    emit('input', input);
};

//上传
const onOversize = (file) => {
    showFailToast('文件大小超过30MB限制');
};
const beforeRead = (file) => {
    switch (input.value.action) {
        case 'photo':
            if (file.type.startsWith('video/') || file.type.startsWith('image/')) {
                return true;
            }
            showFailToast('请选择一个图片或视频文件');
            return false;
            break;
    }
};

const afterRead = (file) => {
    console.log('afterRead', file);
    input.value.content = '';
    input.value.file = file;
    input.value.type = TypeFile;
    emit('callback', input);
};

const cameraCb = (e) => {
  console.log("cameraCb", e);
  input.value.content = '';
  if (e.type == "picture") {
    input.value.file = {file: e.data.result.file};
  } else {
    input.value.file = {file: e.data.result.blob, options: "video.mp4"};
  }
  input.value.type = TypeFile;
  emit('callback', input);
};

const redPacketCb = (id) => {
  console.log("redPacketCb", id);
  input.value.action = input.value.type = TypeRedPacket;
  input.value.content = '';
  input.value.red_packet_id = id;
  input.value.file = null;
  emit('callback', input);
}

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
    console.log('开始录音', e);
    input.value.action = TypeAudio;
    startY.value = e.touches[0].clientY;
    console.log(startY.value);
    isAudioRecording.value = true;
    isCancelAudioRecording.value = false;
    audioChunks.value = [];
    if (mediaRecorder.value) {
        mediaRecorder.value.start();
        audioDuration.value = 0;
        recorderInterval.value = setInterval(() => {
          audioDuration.value += 1;
        }, 1000);
    }
    animationFrame.value = requestAnimationFrame(animateWave);
};

const stopRecording = (e) => {
    if (mediaRecorder.value && isAudioRecording.value) {
        mediaRecorder.value.stop();
        clearInterval(recorderInterval.value);
        recorderInterval.value = null;
        console.log(isCancelAudioRecording.value ? '取消录音' : '停止录音', e);
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

const handleClickOutside = (e) => {
    // console.log('handleClickOutside', e);
    // console.log(commentRef.value);
    if (commentRef.value && !commentRef.value.contains(e.target)) {
        showEmojiPopup.value = false;
        showMorePopup.value = false;
        if (props.show && !isFirstClick.value) {
            emit('hide');
        }
    }
};

watch(() => props.show, (newVal) => {
    if (newVal) {
        input.value.file = null;
        input.value.type = 'text';
        input.value.content = '';
        input.value.action = '';
        document.addEventListener('click', handleClickOutside);
        setTimeout(() => {
            isFirstClick.value = false;
        }, 200);
    } else {
        document.removeEventListener('click', handleClickOutside);
        isFirstClick.value = true;
    }
})

watch(() => props.content, (newValue, oldValue) => {
    // console.log('watch-new', newValue);
    // console.log('watch-old', oldValue);
    input.value.content = newValue;
})

onMounted(async () => {
    nextTick(() => {
        document.addEventListener('click', handleClickOutside);
    });
    if (props.modules.indexOf('record') !== -1) {
        try {
            mediaStream.value = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: 44100,
                    sampleSize: 16,
                    channelCount: 2,
                    echoCancellation: true,      // 启用回声消除
                    noiseSuppression: true,      // 启用噪声抑制
                    autoGainControl: true        // 启用自动增益控制
                },
            });
            mediaRecorder.value = new MediaRecorder(mediaStream.value);

            mediaRecorder.value.ondataavailable = (event) => {
                audioChunks.value.push(event.data);
            };

            mediaRecorder.value.onstop = () => {
                const audioBlob = new Blob(audioChunks.value, { type: 'audio/wav' });
                audioChunks.value = [];
                if (!isCancelAudioRecording.value) {
                    // 这里可以上传录音文件或进行其他处理
                    console.log('录音文件:', audioBlob);
                    input.value.file = { file: audioBlob, options: "audio.wav", duration: audioDuration.value };
                    input.value.content = '';
                    input.value.type = TypeFile;
                    emit("callback", input);
                }
            };
        } catch (error) {
            console.error('获取本地媒体流失败:', error);
            return showFailToast('获取本地媒体流失败:' + error);
        }
    }
});

onBeforeUnmount(() => {
    if (animationFrame.value) {
        cancelAnimationFrame(animationFrame.value);
    }
});

onUnmounted(async () => {
    if (mediaStream.value) {
        mediaStream.value.getTracks().forEach((track) => track.stop());
    }
});
</script>
<template>
    <div>
        <div :class="'common-comment common-comment-' + props.position" v-if="props.show" ref="commentRef">
            <div class="top">
                <div class="record" v-if="props.modules.indexOf('record') !== -1">
                    <van-icon :name="recordIcon" @click="handleRecordIconClick" />
                </div>
                <van-button v-if="isAudioRecord" type="primary" @touchstart="startRecording" @touchend="stopRecording"
                    @touchmove="handleTouchMove" class="record-button">按住 说话</van-button>
                <textarea v-else type="text" v-model="input.content" @input="handleInput"
                    @keyup.enter="handleKeyupEnter" class="message-textarea" ref="textareaRef"
                    :placeholder="props.placeholder"></textarea>
                <div class="emoji" v-if="props.modules.indexOf('emoji') !== -1">
                    <van-icon :name="appStore.icon.emoji" @click="handleEmojiIconClick" />
                </div>
                <div class="more" v-if="props.modules.indexOf('more') !== -1">
                    <van-icon :name="appStore.icon.more" @click="handleMoreIconClick"
                        v-if="props.modules.indexOf('more') !== -1" />
                </div>
            </div>
            <van-popup v-model:show="showMorePopup" position="bottom" :style="{ width: '100%' }" duration="0.2"
                class="more-bottom" v-if="props.modules.indexOf('more') !== -1" :overlay="false">
                <van-grid :column-num="4" style="width: inherit" square center :border="false">
                    <van-grid-item>
                        <template #default>
                            <van-uploader :before-read="beforeRead" :after-read="afterRead" accept="image/*, video/*"
                                :max-size="uploadMaxSize" @oversize="onOversize" max-count="1"
                                @click="onMoreBottomItemClick('photo')">
                                <div class="more-bottom-item">
                                    <div class="more-bottom-icon">
                                        <van-icon name="photo" size="30" />
                                    </div>
                                    <span class="more-bottom-text">照片</span>
                                </div>
                            </van-uploader>
                        </template>
                    </van-grid-item>
                    <van-grid-item>
                        <template #default>
                            <div class="more-bottom-item" @click="onMoreBottomItemClick('camera')">
                                <div class="more-bottom-icon">
                                    <van-icon name="photograph" size="30" />
                                </div>
                                <span class="more-bottom-text">拍摄</span>
                            </div>
                        </template>
                    </van-grid-item>
                    <van-grid-item>
                        <template #default>
                            <van-uploader :max-size="uploadMaxSize" @oversize="onOversize"
                                @click="onMoreBottomItemClick(TypeFile)" max-count="1">
                                <div class="more-bottom-item">
                                    <div class="more-bottom-icon">
                                        <van-icon name="description" size="30" />
                                    </div>
                                    <span class="more-bottom-text">文件</span>
                                </div>
                            </van-uploader>
                        </template>
                    </van-grid-item>
                    <van-grid-item v-show="props.group == 0">
                        <template #default>
                            <div class="more-bottom-item" @click="showCallMenu = true">
                                <div class="more-bottom-icon">
                                    <van-icon :name="appStore.icon.call" size="30" />
                                </div>
                                <span class="more-bottom-text">视频通话</span>
                            </div>
                        </template>
                    </van-grid-item>
                    <van-grid-item>
                      <template #default>
                        <div class="more-bottom-item" @click="showRedPacketForm = true">
                          <div class="more-bottom-icon">
                            <van-icon :name="appStore.icon.red_packet" size="30" />
                          </div>
                          <span class="more-bottom-text">红包</span>
                        </div>
                      </template>
                    </van-grid-item>
                </van-grid>
            </van-popup>
            <van-popup v-model:show="showEmojiPopup" position="bottom" :style="{ width: '100%' }" duration="0.2"
                class="emoji-bottom" v-if="props.modules.indexOf('emoji') !== -1" :overlay="false">
                <emoji-picker @emojiClick="onSelectEmoji" />
            </van-popup>

        </div>
        <div v-if="props.modules.indexOf('more') !== -1">
          <div class="audio-recording" v-if="isAudioRecording">
              <div :class="isCancelAudioRecording ? 'bubble bubble-cancel' : 'bubble'">
                  <svg class="waveform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30">
                      <path v-for="n in 5" :key="n" :d="wavePath(n)" stroke="white" stroke-width="2" fill="none"
                          :opacity="1 - n * 0.15" />
                  </svg>
              </div>
              <div class="recording-text">
                  {{
                      isCancelAudioRecording ? "松开手指，取消发送" : "正在录音... 上划取消"
                  }}
              </div>
          </div>
          <van-action-sheet v-model:show="showCallMenu" :actions="callActions" @select="onSelectCallAction"
              cancel-text="取消" close-on-click-action />
          <wechat-camera :open="openCamera" @close="openCamera = false" @cameraCb="cameraCb"></wechat-camera>
          <chat-red-packet-form :show="showRedPacketForm" @hide="showRedPacketForm = false" @sendCb="redPacketCb" :info="props.info"/>
        </div>
    </div>
</template>
<style lang="less">
:root:root {
  --van-grid-item-content-background: transparent;
}
.common-comment {
    position: relative;
    width: 100%;
    background: var(--messge-footer-background);

    >.top {
        border-top: none;
        width: 100%;
        padding: 0.7rem 0.7rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        >textarea,
        button {
            border: none;
            outline: none;
            height: 40px;
            width: 75%;
            font-weight: bold;
            border-radius: 0.2rem;
            color: var(--black-white-color);
            background: var(--messge-footer-input-background);
            flex: 1;
        }

        >textarea {
            box-sizing: border-box;
            padding: 9px 5px;
            max-height: 100px;
            resize: none;
            overflow-y: scroll;
        }

        .record,
        .emoji,
        .more {
            width: 2rem;
            height: inherit;
            display: flex;
            justify-content: flex-end;
            font-size: 1.5rem;
        }

        .record {
            justify-content: flex-start;
        }
    }

    .more-bottom {
        box-sizing: border-box;
        width: 100%;
        padding: 1rem 0;
        background: transparent;

        .more-bottom-item {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;

            .more-bottom-icon {
                height: 4rem;
                width: 4rem;
                background: var(--black20-white-color);
                border-radius: 0.8rem;
                display: flex;
                justify-content: center;
                align-items: center;

                i {
                    color: var(--black4c-whitebc-color);
                }
            }

            .more-bottom-text {
                margin-top: 5px;
                font-size: 12px;
                color: var(--theme-gray-70);
            }
        }
    }

    .van-popup {
        position: relative;
    }

    emoji-picker {
        width: inherit;
        --background: var(--messge-footer-background);
        border-top: 1px solid var(--van-nav-bar-border-color);
        opacity: 0.9;
        height: 18rem;
    }

}

.common-comment-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
}

.common-comment-top {
    position: fixed;
    top: 0;
    left: 0;
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

    .bubble {
        position: relative;
        background-color: var(--theme-primary-color);
        padding: 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;

        .waveform {
            width: 100px;
            height: 30px;
        }
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
        border-top: 10px solid var(--theme-primary-color);
    }

    .bubble-cancel {
        background-color: var(--theme-danger-color);
    }

    .bubble-cancel::before {
        border-top: 10px solid var(--theme-danger-color);
    }

    .recording-text {
        font-size: 16px;
        font-weight: bold;
        color: var(--theme-gray-70);
    }
}
</style>
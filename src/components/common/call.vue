<script setup>
import { onMounted, ref, inject, watch, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import * as messageApi from "@/api/message";
import { StatusIncalling, StatusInclosing, StatusInwaiting, StatusIncoming } from "@/enums/call";
import { TypeAudioCall, TypeVideoCall } from "@/enums/message";
import { showFailToast } from "vant";
import { isCall, caller, overCall, callType } from "@/utils/call";
import { durationFormat } from "@/utils/helper";
import { messageList, getChatList } from "@/utils/chat";
import emitter from "@/utils/emitter";
import { useAppStore } from "@/stores/app";
import { UnreadChat } from "@/enums/app";

const appStore = useAppStore();
const route = useRoute();
const sysAudio = inject("SysAudio");
const msgId = ref(null);
const callDuration = ref(0);
const interval = ref(null);
const callStatus = ref(StatusInwaiting);
const showCall = ref(false);
const remoteAudio = ref(null);
const localVideo = ref(null);
const localVideoOffset = ref({ x: 10, y: 10 });
const remoteVideo = ref(null);
const controlsBtn = ref({
    camera: false,
    microphone: true,
    speaker: true,
    blur: false
});
const stream = ref(null);  // 本地视频流
const remoteStream = ref(null);  // 远程视频流
const peerConnection = ref(null);
const iceCandidateQueue = ref([]);

// 配置 STUN/TURN 服务器
const configuration = {
    iceServers: [
        {
            urls: 'stun:stun.l.google.com:19302'
        }
    ]
};

// 启动通话（发起方）
const inwatingCall = async () => {
    controlsBtn.value.camera = callType.value === TypeVideoCall;
    // 获取本地媒体流
    try {
        stream.value = await navigator.mediaDevices.getUserMedia({
            video: callType.value === TypeVideoCall,
            audio: true
        });
        if (callType.value === TypeVideoCall) {
            localVideo.value.srcObject = stream.value;
        }
    } catch (error) {
        console.error('获取本地媒体流失败:', error);
        closeThem();
        return showFailToast('获取本地媒体流失败:' + error);
    }

    // 初始化 PeerConnection
    peerConnection.value = new RTCPeerConnection(configuration);

    // 添加本地媒体流到PeerConnection
    stream.value.getTracks().forEach((track) => {
        peerConnection.value.addTrack(track, stream.value);
    });

    // 捕获远端流
    peerConnection.value.ontrack = (event) => {
        remoteStream.value = event.streams[0];
        if (callType.value === TypeVideoCall) {
            remoteVideo.value.srcObject = remoteStream.value;
        } else {
            remoteAudio.value.srcObject = remoteStream.value;
        }
    };

    // 创建 offer
    const offer = await peerConnection.value.createOffer();
    await peerConnection.value.setLocalDescription(offer);

    // 监听ICE候选
    peerConnection.value.onicecandidate = (event) => {
        if (event.candidate) {
            messageApi.send({
                id: msgId.value ? msgId.value : -1,
                to_user: caller.value.id,
                content: '监听ICE候选',
                type: callType.value,
                is_group: 0,
                action: 'ice-candidate',
                candidate: event.candidate
            });
        }
    };

    // 发起方拉起通话界面，等待接收方接听
    messageApi.send({
        to_user: caller.value.id,
        content: '发起方发起通话',
        type: callType.value,
        is_group: 0,
        action: 'offer',
        offer: offer
    }).then((res) => {
        if (res.code == 200001) {
            callStatus.value = StatusInwaiting;
            showCall.value = true;
            msgId.value = res.data.id;
            playAudio();
            // 30秒内未接听，挂断
            setTimeout(() => {
                if (callStatus.value == StatusInwaiting) {
                    endCall('timeout', '无人接听');
                }
            }, 30000);
            messageApi.read({
                to_user: caller.value.id,
                is_group: 0
            });
        }
    });
}

// 接收方拉起来电界面
const incommingCall = async (data) => {
    caller.value = data.from;
    caller.value.offer = data.offer;
    callType.value = data.type;
    messageApi.send({
        to_user: caller.value.id,
        content: '接收方拉起通话',
        type: callType.value,
        is_group: 0
    }).then((res) => {
        if (res.code == 200001) {
            msgId.value = res.data.id;
            showCall.value = true;
            callStatus.value = StatusIncoming;
            playAudio();
        }
    });
};

// 主动挂断通话
const endCall = async (action, content) => {
    messageApi.send({
        id: msgId.value,
        to_user: caller.value.id,
        content: callDuration.value > 0 ? "通话时长 " + durationFormat(callDuration.value) : content,
        type: callType.value,
        is_group: 0,
        duration: callDuration.value,
        action: action
    }).then((res) => {
        if (res.code == 200001) {
            closeThem();
            refreshMessage(res);
        }
    });
}

// 被动挂断通话
const handleEnd = async (action, content) => {
    messageApi.send({
        id: msgId.value,
        to_user: caller.value.id,
        content: callDuration.value > 0 ? "通话时长 " + durationFormat(callDuration.value) : content,
        type: callType.value,
        is_group: 0,
        duration: callDuration.value,
    }).then((res) => {
        if (res.code == 200001) {
            closeThem();
            if (action !== 'timeout') {
                messageApi.read({
                    to_user: caller.value.id,
                    is_group: 0
                });
            } else {
                appStore.unreadIncrBy(UnreadChat);
            }
            refreshMessage(res);
        }
    });
};

// 关闭通话处理
const closeThem = () => {
    msgId.value = null;
    showCall.value = false;
    callStatus.value = StatusInclosing;
    controlsBtn.value.camera = false;
    controlsBtn.value.microphone = true;
    controlsBtn.value.speaker = true;
    console.log('关闭通话：', showCall.value, callStatus.value);
    overCall();
    if (peerConnection.value) {
        peerConnection.value.close();
        peerConnection.value = null;
    }
    if (stream.value) {
        const tracks = stream.value.getTracks();
        tracks.forEach((track) => track.stop());
    }
    if (localVideo.value)
        localVideo.value.srcObject = null;
    if (remoteVideo.value)
        remoteVideo.value.srcObject = null;
    if (remoteAudio.value)
        remoteAudio.value.srcObject = null;
    if (interval.value) {
        clearInterval(interval.value);
        interval.value = null;
    }
    callDuration.value = 0;
    iceCandidateQueue.value = [];
    pauseAudio(true);
};

// 接收方同意接听
const answerCall = async () => {
    // 获取本地媒体流
    try {
        stream.value = await navigator.mediaDevices.getUserMedia({
            video: callType.value === TypeVideoCall,
            audio: true
        });
        if (callType.value === TypeVideoCall) {
            localVideo.value.srcObject = stream.value;
        }
    } catch (error) {
        console.error('获取本地媒体流失败:', error);
        await endCall("reject", "已拒绝接听");
        return showFailToast('获取本地媒体流失败:' + error);
    }

    // 初始化 PeerConnection
    peerConnection.value = new RTCPeerConnection(configuration);

    // 添加本地媒体流到PeerConnection
    stream.value.getTracks().forEach((track) => {
        peerConnection.value.addTrack(track, stream.value);
    });

    // 捕获远端流
    peerConnection.value.ontrack = (event) => {
        remoteStream.value = event.streams[0];
        if (callType.value === TypeVideoCall) {
            remoteVideo.value.srcObject = remoteStream.value;
        } else {
            remoteAudio.value.srcObject = remoteStream.value;
        }
    };

    await peerConnection.value.setRemoteDescription(new RTCSessionDescription(caller.value.offer));

    // 创建 answer
    const answer = await peerConnection.value.createAnswer();
    await peerConnection.value.setLocalDescription(answer);

    // 监听ICE候选
    peerConnection.value.onicecandidate = (event) => {
        if (event.candidate) {
            messageApi.send({
                id: msgId.value ? msgId.value : -1,
                to_user: caller.value.id,
                content: '监听ICE候选',
                type: callType.value,
                is_group: 0,
                action: 'ice-candidate',
                candidate: event.candidate
            });
        }
    };

    iceCandidateQueue.value.forEach(async (candidate) => {
        await peerConnection.value.addIceCandidate(candidate);
    });

    iceCandidateQueue.value = [];

    // 发送 answer 给发起方
    messageApi.send({
        id: msgId.value,
        to_user: caller.value.id,
        content: '正在通话中',
        type: callType.value,
        is_group: 0,
        action: 'answer',
        answer: answer
    }).then((res) => {
        if (res.code == 200001) {
            callStatus.value = StatusIncalling;
            pauseAudio();
            interval.value = setInterval(() => {
                ++callDuration.value;
            }, 1000);
            messageApi.read({
                to_user: caller.value.id,
                is_group: 0
            });
        }
    });
}

// 处理接收到的 answer
const handleAnswer = async (answer) => {
    caller.value.answer = answer;
    callStatus.value = StatusIncalling;
    await peerConnection.value.setRemoteDescription(new RTCSessionDescription(answer));
    iceCandidateQueue.value.forEach(async (candidate) => {
        await peerConnection.value.addIceCandidate(candidate);
    });

    iceCandidateQueue.value = [];
    pauseAudio();
    interval.value = setInterval(() => {
        ++callDuration.value;
    }, 1000);
};

// 处理新的 ICE 候选
const handleNewICECandidate = async (candidate) => {
    const iceCandidate = new RTCIceCandidate(candidate);
    if (peerConnection.value?.signalingState === 'have-remote-offer' || peerConnection.value?.signalingState === 'stable') {
        peerConnection.value.addIceCandidate(iceCandidate);
    } else {
        iceCandidateQueue.value.push(iceCandidate);
    }
};

const onCallMessage = async (data) => {
    console.log("Call:onMessage", data);
    const action = data.data?.action;
    switch (action) {
        case "offer":
            await incommingCall(data.data);
            break;
        case "answer":
            await handleAnswer(data.data?.answer);
            break;
        case "ice-candidate":
            await handleNewICECandidate(data.data?.candidate);
            break;
        case "timeout":
            await handleEnd(action, '您未接听');
            break;
        case "reject":
            await handleEnd(action, '对方已拒绝');
            break;
        case "end":
            await handleEnd(action, '已挂断');
            break;
    }
};

const playAudio = async () => {
    sysAudio.call.start.loop = true;
    sysAudio.call.start.play();
    callDuration.value = 0;
};

const pauseAudio = async (end = false) => {
    sysAudio.call.start.loop = false;
    sysAudio.call.start.pause();
    if (end) sysAudio.call.end.play();
};

// 摄像头、扬声器、麦克风开关控制
const controls = (type) => {
    switch (type) {
        case "camera":
            if (callType.value == TypeVideoCall) {
                const videoTrack = stream.value.getVideoTracks()[0];
                if (videoTrack) {
                    controlsBtn.value.camera = !controlsBtn.value.camera;
                    videoTrack.enabled = controlsBtn.value.camera; // 通过 enabled 属性开关摄像头
                    if (controlsBtn.value.camera) {
                        videoTrack.start();// 开启视频流
                    } else {
                        videoTrack.stop();// 停止视频流并释放资源
                    }
                }
            }
            break;
        case "speaker":
            controlsBtn.value.speaker = !controlsBtn.value.speaker;
            if (callType.value == TypeVideoCall) {
                remoteVideo.value.muted = controlsBtn.value.speaker;
            } else {
                remoteAudio.value.volume = controlsBtn.value.speaker ? 1 : 0;
            }
            break;
        case "microphone":
            const audioTrack = stream.value.getAudioTracks()[0];
            if (audioTrack) {
                controlsBtn.value.microphone = !controlsBtn.value.microphone;
                audioTrack.enabled = controlsBtn.value.microphone; // 通过 enabled 属性开关麦克风
            }
            break;
        default:
            controlsBtn.value.blur = !controlsBtn.value.blur;
            break;
    }
}

// 刷新消息
const refreshMessage = async (res) => {
    const currentPath = "/chat/message/" + res.data.to_user + "/0";
    if (route.fullPath === currentPath)
        messageList.value.push(res.data);
    if (route.fullPath === "/chat" || route.fullPath === "/chat?verify=1") {
        getChatList();
    }
}
watch(isCall, async (val) => {
    if (val) {
        await inwatingCall();
    }
});

onMounted(() => {
    emitter.on("onCallMessage", onCallMessage);
});

onBeforeUnmount(() => {
    emitter.off("onCallMessage", onCallMessage);
});
</script>

<template>
    <van-popup v-model:show="showCall" position="bottom" style="width: 100%; height: 100vh;background: transparent;">
        <van-overlay :show="showCall" class="blur-10-9" />
        <div :class="'common-call ' + 'common-call-' + callType">
            <div :class="'call ' + 'call-' + callStatus">
                <div class="user"
                    v-if="(callType != TypeVideoCall) || (callStatus != StatusIncalling && callType == TypeVideoCall)">
                    <van-image :src="caller.avatar" width="6rem" height="6rem" radius="0.6rem" />
                    <div class="nickname">{{ caller.nickname }}</div>
                    <div class="status">
                        <span v-if="callStatus == StatusInwaiting">等待对方接听</span>
                        <span v-else-if="callStatus == StatusIncoming">邀请你通话</span>
                        <span v-else-if="callStatus == StatusIncalling">通话中</span>
                    </div>
                </div>

                <div class="operation incomming" v-if="callStatus == StatusIncoming">
                    <van-button type="danger" icon="close" round class="call-btn call-btn-large"
                        @click="endCall('reject', '已拒绝接听')"></van-button>
                    <van-button type="success" icon="phone" round class="call-btn call-btn-large"
                        @click="answerCall"></van-button>
                </div>
                <div :class="'operation inwaiting-incalling ' + (callStatus == StatusIncalling && callType == TypeVideoCall ? 'blur-1-5' : '')"
                    v-else>
                    <div class="top" v-if="callStatus == StatusIncalling">
                        <span>{{ durationFormat(callDuration) }}</span>
                        <span>已接通</span>
                    </div>
                    <div class="center" v-if="callStatus == StatusIncalling">
                        <div :class="'microphone ' + (controlsBtn.microphone ? 'open' : '')"
                            @click="controls('microphone')">
                            <van-button icon="service-o" round class="call-btn"></van-button>
                            <span>麦克风</span>
                            <span>已{{ controlsBtn.microphone ? '打开' : '关闭' }}</span>
                        </div>
                        <div :class="'speaker ' + (controlsBtn.speaker ? 'open' : '')" @click="controls('speaker')">
                            <van-button icon="volume-o" round class="call-btn"></van-button>
                            <span>扬声器</span>
                            <span>已{{ controlsBtn.speaker ? '打开' : '关闭' }}</span>
                        </div>
                        <div :class="'blur ' + (controlsBtn.blur ? 'open' : '')" @click="controls('blur')"
                            v-if="callType == TypeVideoCall">
                            <van-button icon="photo-o" round class="call-btn"></van-button>
                            <span>背景模糊</span>
                            <span>已{{ controlsBtn.blur ? '打开' : '关闭' }}</span>
                        </div>
                        <div :class="'camera ' + (controlsBtn.camera ? 'open' : '')" @click="controls('camera')"
                            v-if="callType == TypeVideoCall">
                            <van-button icon="video-o" round class="call-btn"></van-button>
                            <span>摄像头</span>
                            <span>已{{ controlsBtn.camera ? '打开' : '关闭' }}</span>
                        </div>
                    </div>
                    <div class="bottom">
                        <van-button type="danger" icon="close" round class="call-btn call-btn-large"
                            @click="endCall('end', '已挂断')"></van-button>
                    </div>
                </div>
            </div>
            <div class="video" v-if="callType == TypeVideoCall">
                <van-floating-bubble v-model:offset="localVideoOffset" axis="xy"
                    style="width: 5.5rem;height: 10rem;z-index: 9999;background: transparent;border-radius: 0;"
                    v-if="controlsBtn.camera">
                    <template #default>
                        <video class="local" autoplay muted ref="localVideo">
                        </video>
                    </template>
                </van-floating-bubble>
                <video class="remote" autoplay ref="remoteVideo" v-if="callStatus == StatusIncalling">
                </video>
                <div :class="'blur ' + (controlsBtn.blur ? 'blur-1-5' : '')"></div>
            </div>
            <audio autoplay ref="remoteAudio" v-if="callType == TypeAudioCall"></audio>
        </div>

    </van-popup>
</template>
<style lang="less">
.van-floating-bubble {
    .local {
        width: inherit;
        height: inherit;
    }
}

.common-call {
    width: inherit;
    height: inherit;
    background: transparent;

    .call {
        height: inherit;
        width: inherit;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 2;
        background: transparent;

        .operation,
        .user {
            width: inherit;
        }

        .user {
            height: 55%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;

            .nickname,
            .status>span {
                font-size: 1.5rem;
                line-height: 2.5rem;
                color: #fff;
            }

            .status {
                span {
                    font-size: 1rem;
                    line-height: 3rem;
                }
            }
        }

        .operation {
            height: 45%;
            position: fixed;
            bottom: 0;
            left: 0;
        }

        .incomming {
            display: flex;
            justify-content: space-around;
            align-items: center;
        }

        .inwaiting-incalling {
            display: flex;
            justify-content: space-around;
            align-items: center;
            flex-direction: column;

            .top {
                display: flex;
                flex-direction: column;
            }

            .top>span {
                color: #fff;
                font-size: 1rem;
                line-height: 3rem;
            }

            >div {
                display: flex;
                justify-content: space-around;
                align-items: center;
                width: inherit;
            }

            .center>div>.btn {
                color: #f5f5f5;
                background: transparent;
                border: 1px solid #dcdee0;
            }

            .center>.open>.btn {
                color: #323233;
                background: #fff;
                border: 1px solid #dcdee0;
            }

            .center>div {

                display: flex;
                align-items: center;
                flex-direction: column;

                span {
                    margin-top: 4px;
                    font-size: 14px;
                    color: #fff;
                }

                span:last-child {
                    font-size: 12px;
                    color: #ccc;
                }

            }
        }
    }

    .video {
        width: inherit;
        height: inherit;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1;

        .blur {
            position: fixed;
            left: 0;
            top: 0;
            width: inherit;
            height: inherit;
            z-index: 3;
        }

        .remote {
            width: inherit;
            height: inherit;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 2;
        }
    }
}
</style>
import { ref, inject } from "vue";
import * as messageApi from "@/api/message";
import * as call from "@/enums/call";
import { useUserStore } from "@/stores/user";

const { userInfo } = useUserStore();
const WebSocketClient = inject("WebSocketClient");
const fromOffer = ref(null);
export const showCommonCall = ref(false);
export const commonCallType = ref(call.CallVideo);
export const commonCallStatus = ref(call.StatusInclosing);
export const callUser = ref({});
export const localVideoRef = ref(null);
export const remoteVideoRef = ref(null);
export const microphoneStatus = ref("");
export const cameraStatus = ref("");
export const speakerStatus = ref("");
export const localStream = ref(null);  // 本地视频流
export const remoteStream = ref(null);  // 远程视频流

const getLocalStream = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStream.value = stream;
        if (localVideoRef.value) {
            localVideo.value.srcObject = stream;
        }

    } catch (error) {
        console.error('获取本地视频流失败:', error);
    }
};

// 拉起等待接听界面
export const startWaiting = async () => {
    showCommonCall.value = true;
    commonCallStatus.value = call.StatusInwaiting;
};

// 关闭通话界面
export const endCalling = async (action) => {
    WebSocketClient.send({
        who: 'user',
        action: 'call',
        data: {
            type: commonCallType.value,
            from: userInfo,
            to: callUser.value,
            action: action
        }
    });
    showCommonCall.value = false;
    commonCallStatus.value = call.StatusInclosing;
    callUser.value = {};
};

// 拉起来电接听界面
export const startIncoming = async (data) => {
    callUser.value = data.from;
    showCommonCall.value = true;
    commonCallStatus.value = call.StatusIncoming;
    commonCallType.value = data.type;
    fromOffer.value = data.offer;
};

export const startIncalling = async (data) => {
    commonCallStatus.value = call.StatusIncalling;
};

export const startCall = async () => {
    // 创建RTCPeerConnection对象
    await getLocalStream();
    const peerConnection = new RTCPeerConnection();
    // 将本地流添加到PeerConnection
    localStream.value.getTracks().forEach(track => peerConnection.addTrack(track, localStream.value));
    // 创建offer
    const offer = await peerConnection.createOffer();
    // 设置本地描述为offer
    await peerConnection.setLocalDescription(offer);

    // 发起通话请求
    WebSocketClient.send({
        who: 'user',
        action: 'call',
        data: {
            type: commonCallType.value,
            from: userInfo,
            to: callUser.value,
            offer: offer
        }
    });

    // 处理接收到的answer
    peerConnection.ontrack = (event) => {
        if (remoteVideoRef.value) {
            remoteVideoRef.value.srcObject = event.streams[0];
        }
    };

    startWaiting();
};

// 初始化通话对象
export const setCallUser = (user) => {
    if (commonCallStatus.value === call.StatusInclosing)
        callUser.value = user;
};

export const handleOffer = async () => {
    const peerConnection = new RTCPeerConnection();

    // 处理本地流
    localStream.value.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream.value);
    });

    // 设置远程的offer
    await peerConnection.setRemoteDescription(new RTCSessionDescription(fromOffer.value));

    // 创建answer
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    // 同意通话回答
    WebSocketClient.send({
        who: 'user',
        action: 'call',
        data: {
            type: commonCallType.value,
            from: userInfo,
            to: callUser.value,
            answer: answer
        }
    });

    // 设置远程视频流
    peerConnection.ontrack = (event) => {
        if (remoteVideoRef.value) {
            remoteVideoRef.value.srcObject = event.streams[0];
        }
    };

    startIncalling();
};

export const handleAnswer = async (answer) => {

    const peerConnection = new RTCPeerConnection();

    // 设置远程的answer
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));

    // 设置远程视频流
    peerConnection.ontrack = (event) => {
        if (remoteVideoRef.value) {
            remoteVideoRef.value.srcObject = event.streams[0];
        }
    };

    startIncalling();
};
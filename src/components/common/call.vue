<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from "vue";
import { CallAudio, CallVideo, StatusIncalling, StatusInwaiting, StatusIncoming } from "@/enums/call";
const props = defineProps({
    show: Boolean,
    type: String,
    status: String,
    to: Object
});

const emit = defineEmits(["hide"]);
const localVideoRef = ref(null);
const remoteVideoRef = ref(null);
const microphoneStatus = ref("");
const cameraStatus = ref("");
const speakerStatus = ref("");
</script>

<template>
    <van-popup v-model:show="props.show" position="bottom" @opened="() => { }" @closed="() => { }"
        style="width: 100%; height: 100%;background: transparent;">
        <div class="overly"></div>
        <div :class="'common-call ' + 'common-call-' + props.type">
            <div :class="'call ' + 'call-' + props.status">
                <div class="user"
                    v-if="(props.type != CallVideo) || (props.status != StatusIncalling && props.type == CallVideo)">
                    <van-image :src="props.to.avatar" width="6rem" height="6rem" radius="1rem" />
                    <div class="nickname">{{ props.to.nickname }}</div>
                    <div class="status">
                        <span v-if="props.status == StatusInwaiting">等待对方接听</span>
                        <span v-else-if="props.status == StatusIncoming">邀请你通话</span>
                        <span v-else-if="props.status == StatusIncalling">通话中</span>
                    </div>
                </div>

                <div class="operation incomming" v-if="props.status == StatusIncoming">
                    <van-button type="danger" icon="close" round class="btn btn-large"></van-button>
                    <van-button type="success" icon="phone" round class="btn btn-large"></van-button>
                </div>
                <div class="operation inwaiting-incalling" v-else>
                    <div class="top">
                        <div :class="'microphone ' + microphoneStatus">
                            <van-button icon="close" round class="btn"></van-button>
                            <span>麦克风</span>
                            <span>已{{ microphoneStatus ? '打开' : '关闭' }}</span>
                        </div>
                        <div :class="'speaker ' + speakerStatus">
                            <van-button icon="close" round class="btn"></van-button>
                            <span>扬声器</span>
                            <span>已{{ speakerStatus ? '打开' : '关闭' }}</span>
                        </div>
                        <div :class="'camera ' + cameraStatus">
                            <van-button icon="close" round class="btn"></van-button>
                            <span>摄像头</span>
                            <span>已{{ cameraStatus ? '打开' : '关闭' }}</span>
                        </div>
                    </div>
                    <div class="bottom"></div>
                </div>
            </div>
            <div class="video" v-if="props.type == CallVideo && props.status == StatusIncalling">
                <video id="local" autoplay muted ref="localVideoRef"></video>
                <video id="remote" autoplay ref="remoteVideoRef"></video>
            </div>
        </div>
    </van-popup>
</template>
<style lang="css">
.btn {
    height: 3.5rem !important;
    width: 3.5rem;
    display: flex !important;
    ;
    justify-content: center;
    align-items: center;
}

.btn-large {
    height: 4.5rem;
    width: 4.5rem;
}

.btn>.van-button__content>.van-button__icon {
    font-size: 1.5rem;
}

.btn-large>.van-button__content>.van-button__icon {
    font-size: 2rem;
}
</style>
<style scoped lang="less">
.overly {
    height: 100%;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    backdrop-filter: blur(10rem);
    background: #000;
    opacity: 0.9;
}

.common-call {
    width: 100%;
    height: 100%;
    background: transparent;

    .call {
        height: inherit;
        width: inherit;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;
        background: transparent;

        .operation,
        .user {
            width: inherit;
        }

        .user {
            height: 70%;
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
            height: 30%;
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
                justify-content: space-around;
                align-items: center;
                width: inherit;

                div {
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

            .bottom {
                display: flex;
                justify-content: space-around;
                align-items: center;
                width: inherit;

            }
        }
    }

    .video {
        background: transparent;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999;

        .local {
            width: 4.5rem;
            height: 8rem;
            position: fixed;
            top: 6rem;
            left: 3rem;
        }

        .remote {
            width: inherit;
            height: inherit;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 10001;
        }
    }
}
</style>
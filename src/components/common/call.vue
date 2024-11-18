<script setup>
import { ref, watch } from "vue";
import * as call from "@/utils/call";
import * as callEnum from "@/enums/call";
import { localVideoRef, remoteVideoRef } from "@/utils/call";

</script>

<template>
    <van-popup v-model:show="call.showCommonCall.value" position="bottom" @opened="() => { }" @closed="() => { }"
        style="width: 100%; height: 100%;background: transparent;">
        <div class="overly"></div>
        <div :class="'common-call ' + 'common-call-' + call.commonCallType.value">
            <div :class="'call ' + 'call-' + call.commonCallStatus.value">
                <div class="user"
                    v-if="(call.commonCallType.value != callEnum.CallVideo) || (call.commonCallStatus.value != callEnum.StatusIncalling && call.commonCallType.value == callEnum.CallVideo)">
                    <van-image :src="call.callUser.value.avatar" width="6rem" height="6rem" radius="1rem" />
                    <div class="nickname">{{ call.callUser.value.nickname }}</div>
                    <div class="status">
                        <span v-if="call.commonCallStatus.value == callEnum.StatusInwaiting">等待对方接听</span>
                        <span v-else-if="call.commonCallStatus.value == callEnum.StatusIncoming">邀请你通话</span>
                        <span v-else-if="call.commonCallStatus.value == callEnum.StatusIncalling">通话中</span>
                    </div>
                </div>

                <div class="operation incomming" v-if="call.commonCallStatus.value == callEnum.StatusIncoming">
                    <van-button type="danger" icon="close" round class="btn btn-large"
                        @click="call.endCalling('refuse')"></van-button>
                    <van-button type="success" icon="phone" round class="btn btn-large"
                        @click="call.handleOffer"></van-button>
                </div>
                <div class="operation inwaiting-incalling" v-else>
                    <div class="top">
                        <div :class="'microphone ' + call.microphoneStatus.value">
                            <van-button icon="close" round class="btn"></van-button>
                            <span>麦克风</span>
                            <span>已{{ call.microphoneStatus.value ? '打开' : '关闭' }}</span>
                        </div>
                        <div :class="'speaker ' + call.speakerStatus">
                            <van-button icon="close" round class="btn"></van-button>
                            <span>扬声器</span>
                            <span>已{{ call.speakerStatus.value ? '打开' : '关闭' }}</span>
                        </div>
                        <div :class="'camera ' + call.cameraStatus.value">
                            <van-button icon="close" round class="btn"></van-button>
                            <span>摄像头</span>
                            <span>已{{ call.cameraStatus.value ? '打开' : '关闭' }}</span>
                        </div>
                    </div>
                    <div class="bottom">
                        <van-button type="danger" icon="close" round class="btn btn-large"
                            @click="call.endCalling('handup')"></van-button>
                    </div>
                </div>
            </div>
            <div class="video" v-if="call.commonCallType.value == callEnum.CallVideo">
                <video id="local" autoplay muted ref="localVideoRef"></video>
                <video id="remote" autoplay ref="remoteVideoRef"
                    v-if="call.commonCallStatus.value == callEnum.StatusIncalling"></video>
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
    height: 4.5rem !important;
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
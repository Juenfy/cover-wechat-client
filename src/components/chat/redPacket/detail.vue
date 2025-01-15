<script setup>
import {ref, watch} from "vue";
import * as redPacketApi from "@/api/redPacket";
import ChatRedPacketRecord from "@/components/chat/redPacket/record.vue";
import { updateRedPacketStatus } from "@/utils/chat";
import {useUserStore} from "@/stores/user";

const userStore = useUserStore();
const props = defineProps({
  show: Boolean,
  redPacket: Object
});
const emit = defineEmits(["hide"]);
const canReceive = ref(false);
const canNotReceive = ref(false);
const message = ref("");
const isReceiving = ref(false);
const showRedPacketRecord = ref(false);

const onClickReceiveBtn = () => {
  isReceiving.value = true;
  const timeout = setTimeout(() => {
    isReceiving.value = false;
  }, 2000);
  redPacketApi.receive(props.redPacket?.id).then((res) => {
    clearTimeout(timeout);
    isReceiving.value = false;
    if (res.code == 200001) {
      userStore.updateInfo("money", res.data.user_money);
      showRecord();
      updateRedPacketStatus("已领取", props.redPacket?.id);
    } else {
      canReceive.value = false;
      canNotReceive.value = true;
      message.value = res.msg;
      updateRedPacketStatus(res.msg, props.redPacket?.id);
    }
  });
};

const showRecord = () => {
  emit("hide");
  showRedPacketRecord.value = true;
}

watch(() => props.show, (val) => {
  if (val) {
    redPacketApi.getDetail(props.redPacket?.id).then((res) => {
      if (res.code == 200001) {
        canReceive.value = true;
      } else {
        canNotReceive.value = true;
        message.value = res.msg;
        updateRedPacketStatus(res.msg, props.redPacket?.id);
      }
    });
  } else {
    message.value = "";
    canReceive.value = false;
    canNotReceive.value = false;
  }
});
</script>

<template>
  <div>
  <van-popup v-model:show="props.show" round class="red-packet-detail">
    <div class="body">
      <div class="from">
        <van-image width="1rem" height="1rem" radius="0.1rem" :src="props.redPacket?.from.avatar"/>
        <span>{{ props.redPacket?.from.nickname }}的红包</span>
      </div>
      <button type="button" :class="'receive-btn' + (isReceiving ? ' rote3dy360' : '')" @click="onClickReceiveBtn" v-if="canReceive">开</button>
      <div class="message-box" v-if="canNotReceive">
        <h3>{{ message }}</h3>
        <span @click="showRecord">查看红包记录</span>
      </div>
    </div>
    <div class="close" @click="$emit('hide')">
      <van-icon name="close" size="40"/>
    </div>
  </van-popup>
    <chat-red-packet-record :show="showRedPacketRecord" @hide="showRedPacketRecord = false" :redPacket = "props.redPacket"/>
  </div>
</template>

<style lang="less">
.red-packet-detail {
  background: transparent !important;

  .body {
    width: 250px;
    height: 471px;
    background-image: url("/red-packet-bg.jpg");
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: center;
    border-radius: var(--van-popup-round-radius);
    overflow: hidden;
    position: relative;

    .from {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: inherit;
      span {
        display: block;
        margin-left: 5px;
        color: palegoldenrod;
        font-size: 12px;
        font-weight: bold;
      }
    }
    .receive-btn {
      height: 55px;
      width: 55px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 114px;
      border-radius: 50%;
      border: none;
      background: palegoldenrod;
      cursor: pointer;
      box-shadow: 0px 10px 5px -3px rgba(0, 0, 0, 0.2),
      0px 20px 10px rgba(0, 0, 0, 0.05),
      0px 30px 15px rgba(0, 0, 0, 0.02);
      perspective: 100px;
      font-size: 20px;
      color: var(--theme-black);
    }

    .message-box {
      width: inherit;
      position: absolute;
      left: 0;
      bottom: 114px;
      color: goldenrod;
      text-align: center;
      padding: 0 10px;

      span {
        display: block;
        margin-top: 2rem;
        cursor: pointer;
      }
    }
  }

  .close {
    padding: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: goldenrod;
  }
}

@media (max-device-width: 390px) {
  .red-packet-detail {
    .body {
      width: 200px;
      height: 377px;

      .receive-btn {
        height: 55px;
        width: 55px;
        bottom: 94px;
      }

      .message-box {
        bottom: 94px;
      }
    }
  }
}

@media (min-device-width: 768px) {
  .red-packet-detail {
    .body {
      width: 350px;
      height: 659px;

      .receive-btn {
        height: 70px;
        width: 70px;
        bottom: 150px;
      }

      .message-box {
        bottom: 150px;
      }
    }
  }
}

@media (min-device-width: 768px) and (max-device-height: 800px) {
  .red-packet-detail {
    .body {
      width: 200px;
      height: 377px;

      .receive-btn {
        height: 55px;
        width: 55px;
        bottom: 94px;
      }

      .message-box {
        bottom: 94px;
      }
    }
  }
}
</style>
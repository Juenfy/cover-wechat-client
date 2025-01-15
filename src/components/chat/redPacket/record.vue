<script setup>
import {ref, watch} from "vue";
import * as redPacketApi from "@/api/redPacket";

const props = defineProps({
  show: Boolean,
  redPacket: Object
});
const page = ref(1);

watch(() => props.show, (val) => {
  if (val) {
    page.value = 1;
    redPacketApi.getRecordList(props.redPacket.id, page.value, 10).then((res) => {
      console.log(res);
    });
  }
});
</script>

<template>
  <van-popup v-model:show="props.show" position="bottom" class="red-packet-record">
    <header>
      <van-nav-bar left-arrow @click-left="$emit('hide')" :border="false"/>
    </header>
    <section>
      <div class="from">
        <van-image width="3rem" height="3rem" radius="0.3rem" :src="props.redPacket?.from.avatar"/>
        <h4>“{{ props.redPacket?.from.nickname }}”的红包</h4>
        <h3 style="color: red">¥{{ (props.redPacket?.money/100).toFixed(2) }}</h3>
      </div>
    </section>
  </van-popup>

</template>

<style lang="less">
.red-packet-record {
  width: 100%;
  height: 100%;
  background: transparent;

  header > .van-nav-bar {
    background: transparent;
  }

  section {
    background-image: url("/red-packet-record-bg.jpg");
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: center;
    position: relative;

    .from {
      width: 245px;
      height: 245px;
      position: absolute;
      top: 200px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem;
      color: goldenrod;
      gap: 2rem;
    }
  }
}

@media (max-device-width: 390px) {
  .red-packet-record {
    section {

      .from {
        height: 200px;
        width: 200px;
        top: 170px;
      }

    }
  }
}

@media (max-device-width: 375px) {
  .red-packet-record {
    section {

      .from {
        height: 200px;
        width: 200px;
        top: 120px;
      }

    }
  }
}

@media (max-device-width: 360px) {
  .red-packet-record {
    section {
      .from {
        height: 200px;
        width: 200px;
        top: 140px;
      }

    }
  }
}

@media (min-device-width: 768px) {
  .red-packet-record {
    section {

      .from {
        height: 55px;
        width: 55px;
        bottom: 94px;
      }

    }
  }
}

@media (min-device-width: 768px) and (max-device-height: 800px) {
  .red-packet-record {
    section {

      .from {
        height: 55px;
        width: 55px;
        bottom: 94px;
      }

    }
  }
}
</style>
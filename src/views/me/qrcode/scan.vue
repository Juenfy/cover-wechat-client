<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { QrcodeStream } from "vue-qrcode-reader";
const wrapper = ref(null);
const router = useRouter();
const torchActive = ref(false);
const torchNotSupported = ref(false);
const paused = ref(false);
const result = ref([]);

const requestFullscreen = () => {
  const elem = wrapper.value;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE/Edge */
    elem.msRequestFullscreen();
  }
};

const icon = computed(() => {
  if (torchActive.value) {
    return "/flash-on.png";
  } else {
    return "/flash-off.png";
  }
});

const onClickRight = () => {
  torchActive.value = !torchActive.value;
};

const onError = (e) => {
  console.error(e);
};

const onCameraOn = (capabilities) => {
  console.log(capabilities);
  torchNotSupported.value = !capabilities.torch;
};

const onCameraOff = (capabilities) => {
  console.log(capabilities);
};

const timeout = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const onDetect = async (detectedCodes) => {
  result.value = detectedCodes.map((code) => code.rawValue);
  paused.value = true;
  await timeout(500);
  paused.value = false;
  router.push({
    name: "friend-info",
    params: {
      wechat: result.value[0],
    },
  });
};

onMounted(() => {
  requestFullscreen;
});
</script>
<template>
  <div class="fullscreen" ref="wrapper">
    <van-nav-bar
      left-arrow
      @click-left="router.go(-1)"
      @click-right="onClickRight"
      :border="false"
      style="background: transparent"
    >
      <template #left>
        <van-image
          src="/public/back.png"
          width="2rem"
          height="2rem"
        ></van-image>
      </template>
      <template #right v-if="!torchNotSupported"
        ><van-image :src="icon" width="2rem" height="2rem"></van-image
      ></template>
    </van-nav-bar>
    <qrcode-stream
      @error="onError"
      :torch="torchActive"
      @camera-on="onCameraOn"
      @camera-off="onCameraOff"
      @detect="onDetect"
    >
    </qrcode-stream>
  </div>
</template>
<style scoped>
.fullscreen {
  background: transparent;
  position: fixed;
  z-index: 1000;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}
</style>

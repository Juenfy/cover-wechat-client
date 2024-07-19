<script setup>
import { ref, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { showFailToast, showConfirmDialog, showImagePreview } from "vant";
import * as fileApi from "@/api/file";
import { handleResponse } from "@/utils/helper";
import { useUserStore } from "@/stores/user";
import * as userApi from "@/api/user";
const userStore = useUserStore();
const props = defineProps({ show: Boolean });
const emit = defineEmits(["hide", "takePhotoCb"]);
const router = useRouter();
const video = ref(null);
const canvas = ref(null);
const stream = ref(null);
const ctx = ref(null);
const usingFrontCamera = ref(true);
const constraints = ref({
  audio: false,
  video: {
    facingMode: "user",
  },
});

const photoList = ref([]);

const lastPhoto = ref(null);

const startCamera = async () => {
  constraints.value.video.facingMode = usingFrontCamera.value
    ? "user"
    : { exact: "environment" };
  try {
    ctx.value = canvas.value.getContext("2d");
    stream.value = await navigator.mediaDevices.getUserMedia(constraints.value);
    video.value.srcObject = stream.value;
    // 额外的绑定处理，确保在所有浏览器中正常工作
    video.value.onloadedmetadata = () => {
      video.value.play();
    };
    console.log("打开摄像头");
  } catch (err) {
    console.error("Error accessing camera:", err);
    return showFailToast("找不到摄像头");
  }
};

const stopCamera = async () => {
  if (stream.value) {
    console.log("停止摄像头");
    const tracks = stream.value.getTracks();
    tracks.forEach((track) => track.stop());
  }
};

const switchCamera = async (event) => {
  console.log("切换摄像头");
  event.stopPropagation(); // 防止事件冒泡
  usingFrontCamera.value = !usingFrontCamera.value;
  await stopCamera();
  await startCamera();
};

const takePhoto = async (event) => {
  console.log("点击拍照");
  event.stopPropagation(); // 防止事件冒泡
  canvas.value.width = video.value.videoWidth;
  canvas.value.height = video.value.videoWidth;
  ctx.value.drawImage(
    video.value,
    0,
    0,
    canvas.value.width,
    canvas.value.height
  );
  lastPhoto.value = canvas.value.toDataURL("image/jpeg");
  photoList.value.push(lastPhoto.value);
  // emit("takePhotoCb", lastPhoto.value);
};

const previewImage = () => {
  showImagePreview({
    images: photoList.value,
    startPosition: photoList.value.length - 1,
    beforeClose: (e) => {
      console.log(e);
      return true;
    },
    onClose: (e) => {
      showConfirmDialog({
        title: "提示",
        message: "确认使用这张图片作为头像吗？",
      }).then(() => {
        fileApi.uploadBase64({ base64: e.url }).then((res) => {
          handleResponse(
            res,
            () => {
              userApi.putUpdate({ avatar: res.data.path }).then(() => {
                userStore.updateInfo("avatar", res.data.url);
                emit("hide");
              });
            },
            router,
            true
          );
        });
      });
    },
  });
};
onUnmounted(async () => {
  await stopCamera();
});
</script>

<template>
  <van-popup
    v-model:show="props.show"
    position="right"
    @opened="startCamera"
    @closed="stopCamera"
    style="width: 100%; height: 100%"
  >
    <div class="camera">
      <header>
        <div class="back-button" @click="$emit('hide')">
          <svg viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </div>
      </header>
      <div class="container">
        <video ref="video" autoplay playsinline></video>
        <div class="controls">
          <div class="pictures" @click="previewImage">
            <van-image
              width="70"
              height="70"
              fit="cover"
              v-if="lastPhoto"
              :src="lastPhoto"
            />
          </div>
          <div class="switch-button" @click="switchCamera">
            <svg viewBox="0 0 24 24">
              <path
                d="M12 5V3L8 7l4 4V8c2.76 0 5 2.24 5 5 0 .34-.03.67-.08 1h2.02c.05-.33.06-.66.06-1 0-3.86-3.14-7-7-7zm-1 8c-2.76 0-5-2.24-5-5 0-.34.03-.67.08-1H4.06c-.05.33-.06.66-.06 1 0 3.86 3.14 7 7 7v2l4-4-4-4v3z"
              />
            </svg>
          </div>
          <div class="camera-button" @click="takePhoto"></div>
        </div>

        <div @click="takePhoto" class="camera-button"></div>
        <div @click="switchCamera" class="switch-button"></div>
      </div>
      <canvas ref="canvas" style="display: none"></canvas>
    </div>
  </van-popup>
</template>
<style scoped lang="less">
.camera {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: var(--van-black);
  header {
    position: relative;
    width: 100%;
    .back-button {
      background-color: rgba(255, 255, 255, 0.4);
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: background-color 0.1s ease;
      z-index: 20; /* 确保按钮在video元素之上 */
      position: absolute;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      left: 20px;
      top: 10px;
    }
    .back-button:hover {
      background-color: rgba(255, 255, 255, 0.6);
    }

    .back-button svg {
      height: 24px;
      width: 24px;
      fill: var(--van-white);
    }
  }
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    flex: 1; /* 占满剩余空间 */
    position: relative;
    width: 100%;
    video {
      width: 100%;
      aspect-ratio: 1; /* 宽高比为 1:1 */
      object-fit: cover; /* 保持视频比例，裁剪超出部分 */
      pointer-events: none; /* 防止video元素阻止点击事件 */
    }
    .controls {
      position: absolute;
      bottom: 20px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10; /* 确保按钮在video元素之上 */
      .pictures,
      .camera-button {
        width: 70px;
        height: 70px;
        overflow: hidden;
      }
      .pictures,
      .camera-button,
      .switch-button {
        background-color: rgba(255, 255, 255, 0.4);
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: background-color 0.1s ease;
        z-index: 20; /* 确保按钮在video元素之上 */
      }
      .pictures {
        border-radius: 4px;
        opacity: 0.8;
        position: absolute;
        left: 20px;
      }
      .camera-button {
        border: 6px solid rgba(255, 255, 255, 0.8);
        border-radius: 50%;
      }

      .camera-button::before {
        content: "";
        width: 58px;
        height: 58px;
        border-radius: 50%;
        background-color: var(--van-white);
        transition: transform 0.1s ease;
      }

      .camera-button:active::before {
        transform: scale(0.9);
      }

      .switch-button {
        position: absolute;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        right: 20px;
        bottom: 10px;
      }

      .switch-button:hover {
        background-color: rgba(255, 255, 255, 0.6);
      }

      .switch-button svg {
        width: 24px;
        height: 24px;
        fill: var(--van-white);
      }
    }
  }
}
</style>

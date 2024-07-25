<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import QRCode from "qrcode";

const router = useRouter();
const userStore = useUserStore();
const style = ref("purple-blue");
const styles = ref([
  "purple-blue",
  "pink-yellow",
  "green-blue",
  "blue-green",
  "orange-red",
  "light-purple-blue",
  "red-purple",
  "yellow-orange",
  "dark-light-blue",
]);
const qrcodeCanvas = ref(null);
const generateQRCode = () => {
  const canvas = qrcodeCanvas.value;
  QRCode.toCanvas(
    qrcodeCanvas.value,
    userStore.info.wechat + "?t=" + new Date().getTime(),
    {
      errorCorrectionLevel: "H",
    },
    (error) => {
      if (error) console.error(error);
      console.log("QR code generated successfully");
    }
  );
};
const changeStyle = () => {
  while (true) {
    const randomIndex = Math.floor(Math.random() * styles.value.length);
    if (styles.value[randomIndex] !== style.value) {
      style.value = styles.value[randomIndex];
      break;
    }
  }
};
onMounted(() => {
  generateQRCode();
});
</script>
<template>
  <section :class="style">
    <div class="header qrcode-header">
      <van-nav-bar
        left-arrow
        @click-left="router.go(-1)"
        @click-right="true"
        style="background-color: transparent"
        :border="false"
      >
        <template #right>
          <van-icon name="ellipsis" size="20" color="#191919" />
        </template>
      </van-nav-bar>
    </div>

    <div class="container qrcode-container">
      <div>
        <div class="info-box">
          <van-image :src="userStore.info.avatar" height="100%" />
          <div class="text-box">
            <span>{{ userStore.info.nickname }}</span>
            <span>英国 贝尔法斯特</span>
          </div>
        </div>
        <div class="qrcode-box">
          <canvas ref="qrcodeCanvas"></canvas>
          <p>扫一扫上面的二维码图案，加我为朋友</p>
        </div>
      </div>
    </div>
    <div class="footer qrcode-footer">
      <span @click="router.push('/me/qrcode/scan')">扫一扫</span>|<span
        @click="changeStyle"
        >换个样式</span
      >|<span>保存图片</span>
    </div>
  </section>
</template>
<style scope lang="less">
.purple-blue {
  background: linear-gradient(135deg, #667eea, #764ba2);
}
.pink-yellow {
  background: linear-gradient(135deg, #ff9a9e, #fad0c4);
}
.green-blue {
  background: linear-gradient(135deg, #a8edea, #fed6e3);
}
.blue-green {
  background: linear-gradient(135deg, #89f7fe, #66a6ff);
}
.orange-red {
  background: linear-gradient(135deg, #ff9a8b, #ff6a88, #ff99ac);
}
.light-purple-blue {
  background: linear-gradient(135deg, #d4fc79, #96e6a1);
}
.red-purple {
  background: linear-gradient(135deg, #ff758c, #ff7eb3);
}
.yellow-orange {
  background: linear-gradient(135deg, #ff9a44, #fc6076);
}
.dark-light-blue {
  background: linear-gradient(135deg, #1e3c72, #2a5298);
}
section {
  .qrcode-header {
    .van-nav-bar {
      .van-icon {
        color: var(--van-white) !important;
      }
    }
  }
  .qrcode-container {
    display: flex !important;
    justify-content: center;
    align-items: center;
    background: transparent;
    .qrcode-box,
    .info-box {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .info-box {
      margin-bottom: 1rem;
      height: 4rem;
      justify-content: flex-start;
      flex-direction: row;
      .text-box {
        height: 100%;
        display: flex;
        justify-content: space-around;
        flex-direction: column;
        text-indent: 1rem;
        span:first-child {
          font-size: 24px;
          font-weight: bold;
          color: var(--van-white);
        }
        span:last-child {
          font-size: 12px;
          color: var(--theme-text-color-inverse);
        }
      }
    }
    .qrcode-box {
      flex-direction: column;
      canvas {
        width: 100% !important;
        height: 100% !important;
      }
      p {
        font-size: 13px;
        color: var(--theme-text-color-inverse);
      }
    }
  }
  .qrcode-footer {
    box-sizing: border-box;
    padding: 0 3rem;
    display: flex;
    justify-content: space-around;
    color: var(--van-white);
    span {
      font-weight: bold;
    }
  }
}
</style>

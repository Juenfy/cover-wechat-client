<script setup>
import { onMounted } from "vue";
import { useAppStore } from "@/stores/app";
import { useRoute } from "vue-router";
const appStore = useAppStore();
const route = useRoute();
onMounted(() => {
  appStore.initHeader({ title: "发现", navbar: true, search: false });
  console.log(route.query);
});
</script>
<template>
  <div class="common discover">
    <van-cell-group>
      <van-cell :center="true" is-link to="/discover/moment">
        <template #title>
          <van-image height="1.5rem" width="1.5rem" src="/moment.png" />
          <div class="left-box" style="">
            <span>朋友圈</span>
            <span></span>
          </div>
        </template>
        <template #value>
          <van-badge v-if="appStore.unread.moment > 0" :content="appStore.unread.moment" max="99"
            class="van-badge--center" />
        </template>
      </van-cell>
      <van-cell :center="true" is-link to="/me/qrcode/scan">
        <template #title>
          <van-image height="1.5rem" width="1.5rem" src="/scan-o.png" />
          <div class="left-box" style="">
            <span>扫一扫</span>
            <span></span>
          </div>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

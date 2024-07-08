<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const showPostMomentMenu = ref(false);
</script>
<template>
  <header>
    <van-nav-bar
      left-arrow
      @click-left="router.go(-1)"
      @click-right="showPostMomentMenu"
      style="background: transparent"
    >
      <template #right>
        <van-icon name="smile-o"></van-icon>
      </template>
    </van-nav-bar>
  </header>
  <main></main>
  <van-popup
    v-model:show="showPostMomentMenu"
    position="right"
    style="height: "
  >
    <van-cell-group>
      <van-cell title="发布动态" @click="" />
    </van-cell-group>
  </van-popup>
</template>
<style scoped lang="less"></style>

<script setup>
const props = defineProps({ show: Boolean });
defineEmits(["hide"]);
const onSearch = (e) => {
  console.log(e);
};
</script>

<template>
  <van-popup
    v-model:show="props.show"
    position="right"
    :style="{
      height: '100%',
      width: '100%',
      background: 'var(--van-nav-bar-background)',
      paddingTop: '1.5rem',
    }"
    duration="0.2"
  >
    <van-search
      v-model="value"
      show-action
      placeholder="搜索"
      @search="onSearch"
      @cancel="$emit('hide')"
    />
    <p style="text-align: center; color: var(--theme-text-color-tint)">
      快速搜索聊天内容
    </p>
    <van-row
      justify="center"
      style="color: var(--theme-blue-tint); margin-top: 1rem"
    >
      <van-col span="4" style="text-align: center">日期</van-col>
      <van-col
        span="6"
        style="
          text-align: center;
          border-left: 0.1rem solid #e3e3e3;
          border-right: 0.1rem solid #e3e3e3;
          box-sizing: border-box;
        "
        >图片与视频</van-col
      >
      <van-col span="4" style="text-align: center">文件</van-col>
    </van-row>
    <van-row
      justify="center"
      style="color: var(--theme-blue-tint); margin-top: 1rem"
    >
      <van-col span="4" style="text-align: center">链接</van-col>
      <van-col
        span="6"
        style="
          text-align: center;
          border-left: 0.1rem solid #e3e3e3;
          border-right: 0.1rem solid #e3e3e3;
          box-sizing: border-box;
        "
        >音乐与音频</van-col
      >
      <van-col span="4" style="text-align: center">交易</van-col>
    </van-row>
  </van-popup>
</template>
<style scoped>
:root:root {
  --van-search-action-text-color: var(--van-blue);
}
</style>

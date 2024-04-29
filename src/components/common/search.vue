<script setup>
import { watch } from "less";
import { ref, toRefs } from "vue";
const props = defineProps([
  "show",
  "background",
  "action",
  "placeholder",
  "result",
]);
const { show, background, action, placeholder, result } = toRefs(props);
const emit = defineEmits(["hide", "search"]);
const keywords = ref("");
const isSearch = ref(false);
const handleSearch = () => {
  if (keywords.value) {
    emit("search", keywords.value);
    keywords.value = "";
    isSearch.value = true;
  }
};
const handleCancel = () => {
  emit("hide");
  isSearch.value = false;
};
</script>

<template>
  <van-popup
    v-model:show="show"
    position="right"
    :style="{
      height: '100%',
      width: '100%',
      background: background,
    }"
    :autofocus="true"
    duration="0.2"
  >
    <header
      style="
        width: 100%;
        background: var(--van-nav-bar-background);
        padding-top: 2rem;
      "
    >
      <van-search
        v-model="keywords"
        show-action
        :placeholder="placeholder"
        @search="handleSearch"
        @cancel="handleCancel"
      />
    </header>
    <main>
      <template v-if="action == 'chat'">
        <div v-if="isSearch">
          <div v-if="result.length > 0"></div>
          <div v-else>暂无搜索结果</div>
        </div>
        <div v-else>
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
        </div>
      </template>
    </main>
  </van-popup>
</template>
<style scoped lang="less"></style>

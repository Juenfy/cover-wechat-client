<!--通用搜索组件-->
<script setup>
import { onMounted, ref, toRefs, watch } from "vue";
import { useRouter } from "vue-router";
import { SearchFriend, SearchChatRecord } from "@/enums/app";
const props = defineProps(["show", "action", "placeholder"]); //action决定了当前是要搜索什么的意思
const { show, action, placeholder } = toRefs(props);
const emit = defineEmits(["hide", "search"]);
const keywords = ref("");
const isSearch = ref(false);
const searchResult = ref([]);
const background = ref("var(--common-search-background)");
const router = useRouter();

const handleSearch = () => {
  console.log("handleSearch", keywords.value);
  if (keywords.value) {
    //触发父组件搜索
    emit("search", action.value, keywords.value, (res) => {
      //回调拿到搜索结果
      searchResult.value = res.data;
      isSearch.value = true;
      background.value = "var(--van-nav-bar-background)";
    });
  }
};

watch(keywords, (newVal) => {
  if (newVal.length == 0) isSearch.value = false;
});

const handleCancel = () => {
  isSearch.value = false;
  emit("hide");
};

const handleHomeClick = (item) => {
  handleCancel();
  router.push({
    name: "friend-info",
    query: {
      keywords: item.keywords,
    },
  });
};
onMounted(() => {
  //部分搜索界面样式设置
  if ([SearchChatRecord].indexOf(action.value) !== -1) {
    background.value = "var(--van-nav-bar-background)";
  }
  console.log(action.value);
});
</script>

<template>
  <van-popup v-model:show="show" position="right" :style="{
    height: '100%',
    width: '100%',
    background: background,
  }" :autofocus="true" duration="0.2">
    <div style="
        width: 100%;
        background: var(--van-nav-bar-background);
        padding-top: 2rem;
      ">
      <van-search v-model="keywords" show-action :placeholder="placeholder" @search="handleSearch"
        @cancel="handleCancel" />
    </div>
    <div class="common common-search">
      <template v-if="action == SearchFriend">
        <van-cell-group title="联系人" v-if="isSearch && searchResult.length > 0">
          <van-cell :center="true" size="large" v-for="(item, index) in searchResult" :key="index"
            @click="handleHomeClick(item)">
            <template #title>
              <van-image height="3rem" width="3rem" radius="0.3rem" :src="item.avatar" style="margin-right: 0.5rem" />
              <span>{{ item.nickname }}</span>
            </template>
          </van-cell>
        </van-cell-group>
        <div class="no-result" v-else-if="isSearch && searchResult.length == 0">
          用户不存在
        </div>
        <van-cell-group v-else-if="keywords.length > 0">
          <van-cell :center="true" size="large" @click="handleSearch">
            <template #title>
              <van-image height="3rem" width="3rem" radius="0.3rem" src="/search.png" style="margin-right: 0.5rem" />
              <span style="font-weight: bold">搜索：</span><span
                style="color: var(--theme-primary-color); font-weight: bold">{{ keywords }}</span>
            </template>
          </van-cell>
        </van-cell-group>
      </template>
      <template v-if="action == SearchChatRecord && isSearch">
        <div v-if="isSearch">
          <div v-if="searchResult.length > 0"></div>
          <div class="no-result" v-else>暂无搜索结果</div>
        </div>
        <div v-else>
          <p style="text-align: center; color: var(--theme-gray-70)">
            快速搜索聊天内容
          </p>
          <van-row justify="center" style="color: var(--theme-blue-tint); margin-top: 1rem">
            <van-col span="4" style="text-align: center">日期</van-col>
            <van-col span="6" style="
                text-align: center;
                border-left: 0.1rem solid #e3e3e3;
                border-right: 0.1rem solid #e3e3e3;
                box-sizing: border-box;
              ">图片与视频</van-col>
            <van-col span="4" style="text-align: center">文件</van-col>
          </van-row>
          <van-row justify="center" style="color: var(--theme-blue-tint); margin-top: 1rem">
            <van-col span="4" style="text-align: center">链接</van-col>
            <van-col span="6" style="
                text-align: center;
                border-left: 0.1rem solid #e3e3e3;
                border-right: 0.1rem solid #e3e3e3;
                box-sizing: border-box;
              ">音乐与音频</van-col>
            <van-col span="4" style="text-align: center">交易</van-col>
          </van-row>
        </div>
      </template>
      <template v-if="action == 'home' && isSearch">
        <div></div>
      </template>
    </div>
  </van-popup>
</template>
<style lang="less">
.common-search {
  .no-result {
    width: 100%;
    text-align: center;
    line-height: 4rem;
    height: 4rem;
    background: var(--van-white);
    color: var(--theme-gray-70);
  }

  .van-cell-group__title {
    padding: 16px 1px !important;
  }
}
</style>

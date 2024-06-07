<script setup>
import { onMounted, ref, toRefs, watch } from "vue";
import { useRouter } from "vue-router";
import { SearchFriend, SearchChatRecord } from "@/enums/app";
const props = defineProps(["show", "action", "placeholder"]);
const { show, action, placeholder } = toRefs(props);
const emit = defineEmits(["hide", "search"]);
const keywords = ref("");
const isSearch = ref(false);
const searchResult = ref([]);
const background = ref("var(--van-white)");
const router = useRouter();

const handleSearch = () => {
  console.log("handleSearch", keywords.value);
  if (keywords.value) {
    emit("search", action.value, keywords.value, (res) => {
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
    path: "/friend/info",
    query: {
      keywords: item.source == "mobile" ? item.mobile : item.wechat,
    },
  });
};
onMounted(() => {
  if ([SearchChatRecord].indexOf(action.value) !== -1) {
    background.value = "var(--van-nav-bar-background)";
  }
  console.log(action.value);
});
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
      <template v-if="action == SearchFriend">
        <van-cell-group
          title="联系人"
          v-if="isSearch && searchResult.length > 0"
        >
          <van-cell
            :center="true"
            size="large"
            v-for="(item, index) in searchResult"
            :key="index"
            @click="handleHomeClick(item)"
          >
            <template #title>
              <van-image
                height="3rem"
                width="3rem"
                radius="0.1rem"
                :src="item.avatar"
                style="margin-right: 0.5rem"
              />
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
              <van-image
                height="3rem"
                width="3rem"
                radius="0.1rem"
                src="/public/search.png"
                style="margin-right: 0.5rem"
              />
              <span style="font-weight: bold">搜索：</span
              ><span
                style="color: var(--theme-main-color); font-weight: bold"
                >{{ keywords }}</span
              >
            </template>
          </van-cell>
        </van-cell-group>
      </template>
      <template v-if="action == 'chat' && isSearch">
        <div v-if="isSearch">
          <div v-if="searchResult.length > 0"></div>
          <div class="no-result" v-else>暂无搜索结果</div>
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
      <template v-if="action == 'home' && isSearch">
        <div></div>
      </template>
    </main>
  </van-popup>
</template>
<style scoped lang="less">
main {
  .no-result {
    width: 100%;
    text-align: center;
    line-height: 4rem;
    height: 4rem;
    background: var(--van-white);
    color: var(--theme-text-color-tint);
  }
  .van-cell-group__title {
    padding: 16px 1px !important;
  }
}
</style>

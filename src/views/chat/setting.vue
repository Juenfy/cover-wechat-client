<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/app";
import { SearchChatRecord } from "@/enums/app";
const router = useRouter();
const chatSetting = reactive({ muted: false, top: false, remind: false });
const showClearChat = ref(false);
const appStore = useAppStore();

const onSearchChatRecordClick = () => {
  appStore.setShowCommonSearch(true);
  appStore.initCommonSearch({
    action: SearchChatRecord,
    placeholder: "搜索",
  });
};
</script>

<template>
  <header>
    <van-nav-bar title="聊天详情" left-arrow @click-left="router.go(-1)" />
  </header>
  <main class="main">
    <van-cell-group :style="{ padding: '1rem 0' }">
      <van-grid
        :column-num="5"
        icon-size="3.5rem"
        :border="false"
        :square="true"
      >
        <van-grid-item
          icon="https://q4.itc.cn/q_70/images03/20240405/0fe4005840664f30b76f1a63909a5489.jpeg"
          text="1"
          to="/friend/info"
        />
        <van-grid-item
          icon="https://q4.itc.cn/q_70/images03/20240405/0fe4005840664f30b76f1a63909a5489.jpeg"
          text="1"
          to=""
        />
        <van-grid-item
          icon="https://q4.itc.cn/q_70/images03/20240405/0fe4005840664f30b76f1a63909a5489.jpeg"
          text="1"
          to=""
        />
        <van-grid-item
          icon="https://q4.itc.cn/q_70/images03/20240405/0fe4005840664f30b76f1a63909a5489.jpeg"
          text="1"
          to=""
        />
        <van-grid-item icon="/add.png" text="1" to="" />
      </van-grid>
    </van-cell-group>
    <van-cell-group>
      <van-cell
        title="查找聊天内容"
        is-link
        clickable
        @click="onSearchChatRecordClick"
        size="large"
      />
    </van-cell-group>
    <van-cell-group>
      <van-cell title="消息免打扰" size="large">
        <template #right-icon>
          <van-switch v-model="chatSetting.muted" />
        </template>
      </van-cell>
      <van-cell title="置顶聊天" size="large">
        <template #right-icon>
          <van-switch v-model="chatSetting.top" />
        </template>
      </van-cell>
      <van-cell title="提醒" size="large">
        <template #right-icon>
          <van-switch v-model="chatSetting.remind" />
        </template>
      </van-cell>
    </van-cell-group>
    <van-cell-group>
      <van-cell title="设置当前聊天背景" is-link to="/chat" size="large" />
    </van-cell-group>
    <van-cell-group>
      <van-cell
        title="清除聊天记录"
        clickable
        size="large"
        @click="showClearChat = true"
      />
    </van-cell-group>
    <van-cell-group>
      <van-popup
        v-model:show="showClearChat"
        round
        position="bottom"
        :style="{ background: '#f9f9f9' }"
      >
        <span
          :style="{
            background: '#fff',
            display: 'block',
            textAlign: 'center',
            color: 'red',
            fontSize: 'var(--van-cell-large-title-font-size)',
            lineHeight: '4rem',
            marginBottom: '0.4rem',
          }"
          >清空聊天记录</span
        >
        <span
          @click="showClearChat = false"
          :style="{
            background: '#fff',
            display: 'block',
            textAlign: 'center',
            fontSize: 'var(--van-cell-large-title-font-size)',
            lineHeight: '4rem',
          }"
          >取消</span
        >
      </van-popup>
    </van-cell-group>
  </main>
</template>

<style lang="less" scoped>
.van-cell-group {
  margin-bottom: 0.5rem;
}
</style>

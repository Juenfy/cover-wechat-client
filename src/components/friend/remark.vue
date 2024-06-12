<script setup>
import { useRouter } from "vue-router";
import { reactive, watch } from "vue";
import { useFriendStore } from "@/stores/friend";
import * as friendApi from "@/api/friend";
import { handleResponse } from "@/utils/common";
const friendStore = useFriendStore();
const props = defineProps({ show: Boolean });
const router = useRouter();
//调用父组件关闭弹窗
defineEmits(["hide"]);
const formData = reactive({
  friend: 0,
  nickname: "",
  desc: "",
});

const onSubmit = () => {
  friendApi.putUpdate(formData).then((res) => {
    handleResponse(
      res,
      (res) => {
        router.push({
          path: "/friend/info",
          query: { keywords: friendStore.info.keywords },
        });
      },
      router,
      true
    );
  });
};

watch(
  () => friendStore.info,
  (info) => {
    formData.friend = info.id;
    formData.nickname = info.final_nickname;
    formData.desc = info.desc;
  }
);
</script>
<template>
  <van-popup
    v-model:show="props.show"
    position="bottom"
    :style="{ height: '100%', width: '100%' }"
    duration="0.2"
  >
    <header>
      <van-nav-bar
        left-text="取消"
        @click-left="$emit('hide')"
        @click-right="onSubmit"
        :border="false"
      >
        <template #right>
          <van-button type="primary" size="small">完成</van-button>
        </template>
      </van-nav-bar>
    </header>
    <main>
      <h2>设置备注和标签</h2>
      <van-form>
        <van-cell-group title="备注">
          <van-field
            v-model="formData.nickname"
            name="备注名"
            placeholder="添加备注名"
          />
        </van-cell-group>
        <!-- <van-cell-group title="标签">
          <van-field
            v-model="username"
            is-link
            readonly
            name="标签"
            placeholder="添加标签"
            @click="showPicker = true"
          />
        </van-cell-group> -->
        <van-cell-group title="描述">
          <van-field
            v-model="formData.desc"
            name="描述"
            placeholder="添加文字"
          />
        </van-cell-group>
      </van-form>
    </main>
  </van-popup>
</template>

<style scoped lang="less">
.van-nav-bar {
  background: var(--van-white);
}
main {
  padding: 4rem 2rem;
  h2 {
    text-align: center;
  }
}
</style>

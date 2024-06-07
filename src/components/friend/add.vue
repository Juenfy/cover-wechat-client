<script setup>
import { useAppStore } from "@/stores/app";
import { SearchFriend } from "@/enums/app";
const props = defineProps({ show: Boolean });
//调用父组件关闭弹窗
defineEmits(["hide"]);

const appStore = useAppStore();
const onSearchFocus = () => {
  appStore.setShowCommonSearch(true);
  appStore.initCommonSearch({
    action: SearchFriend,
    placeholder: "账号/手机号",
  });
};
</script>

<template>
  <van-popup
    v-model:show="props.show"
    position="right"
    style="height: 100%; width: 100%; background: var(--van-nav-bar-background)"
    duration="0.2"
  >
    <header>
      <van-nav-bar title="添加朋友" left-arrow @click-left="$emit('hide')" />
      <van-search
        placeholder="账号/手机号"
        input-align="center"
        @focus="onSearchFocus"
      />
    </header>
    <main>
      <p style="text-align: center; line-height: 1">
        我的微信号：phpdalao
        <van-icon name="qr" color="var(--van-primary-color)" />
      </p>
      <van-cell-group>
        <van-cell is-link to="" :center="true" size="large">
          <template #title>
            <van-image
              height="2rem"
              width="2rem"
              radius="0.1rem"
              src="/public/group-create.png"
            />
            <div class="left-box">
              <span>面对面建群</span>
              <span>与身边的朋友进入同一个群聊</span>
            </div>
          </template>
        </van-cell>
        <van-cell is-link to="" :center="true" size="large">
          <template #title>
            <van-image
              height="2rem"
              width="2rem"
              radius="0.1rem"
              src="/public/scan.png"
            />
            <div class="left-box">
              <span>扫一扫</span>
              <span>扫描二维码名片</span>
            </div>
          </template>
        </van-cell>
      </van-cell-group>
    </main>
  </van-popup>
</template>
<style scoped lang="less"></style>

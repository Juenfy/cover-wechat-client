<!--添加朋友组件-->
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
      <van-nav-bar
        title="添加朋友"
        left-arrow
        @click-left="$emit('hide')"
        :border="false"
      />
    </header>
    <section>
      <div class="header"></div>
      <div class="container">
        <van-search
          placeholder="账号/手机号"
          input-align="center"
          @focus="onSearchFocus"
        />
        <div class="common">
          <p
            style="
              text-align: center;
              line-height: 1;
              color: var(--friend-add-qrcode-text);
              margin-bottom: 0.5rem;
            "
          >
            我的微信号：phpdalao
            <van-icon name="qr" color="var(--theme-primary-color)" />
          </p>
          <van-cell-group>
            <van-cell is-link to="" :center="true" size="large">
              <template #title>
                <van-image
                  height="2rem"
                  width="2rem"
                  radius="0.1rem"
                  src="/group-create.png"
                />
                <div class="left-box">
                  <span>面对面建群</span>
                  <span>与身边的朋友进入同一个群聊</span>
                </div>
              </template>
            </van-cell>
            <van-cell is-link to="/me/qrcode/scan" :center="true" size="large">
              <template #title>
                <van-image
                  height="2rem"
                  width="2rem"
                  radius="0.1rem"
                  src="/scan.png"
                />
                <div class="left-box">
                  <span>扫一扫</span>
                  <span>扫描二维码名片</span>
                </div>
              </template>
            </van-cell>
          </van-cell-group>
        </div>
      </div>
    </section>
  </van-popup>
</template>

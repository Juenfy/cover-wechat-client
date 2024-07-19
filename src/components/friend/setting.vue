<script setup>
import { reactive, ref } from "vue";
const props = defineProps({ show: Boolean, info: Object });
//调用父组件关闭弹窗
defineEmits(["hide", "showFR", "showFP"]);
const friendSetting = reactive({
  star: false,
  blacklist: false,
});
const deleteFriend = () => {};
</script>
<template>
  <van-popup
    v-model:show="props.show"
    position="right"
    :style="{ height: '100%', width: '100%' }"
    duration="0.2"
  >
    <header>
      <van-nav-bar
        title="资料设置"
        left-arrow
        @click-left="$emit('hide')"
        :border="false"
      />
    </header>
    <section class="bg-nav">
      <div class="header"></div>
      <div class="container">
        <van-cell-group>
          <van-cell
            title="设置备注和标签"
            is-link
            clickable
            @click="$emit('showFR')"
            :center="true"
            size="large"
            :value="props.info.display_nickname"
          />
          <van-cell
            title="朋友权限"
            is-link
            clickable
            @click="$emit('showFP')"
            :center="true"
            size="large"
          />
        </van-cell-group>
        <van-cell-group>
          <van-cell
            title="把他推荐给朋友"
            is-link
            to=""
            :center="true"
            size="large"
          />
        </van-cell-group>
        <van-cell-group>
          <van-cell title="设置位星标朋友" :center="true" size="large">
            <template #right-icon>
              <van-switch v-model="friendSetting.star" />
            </template>
          </van-cell>
        </van-cell-group>
        <van-cell-group>
          <van-cell title="加入黑名单" :center="true" size="large">
            <template #right-icon>
              <van-switch v-model="friendSetting.blacklist" />
            </template>
          </van-cell>
          <van-cell title="投诉" is-link to="" :center="true" size="large" />
        </van-cell-group>
        <van-button
          size="large"
          :square="true"
          style="margin-top: 0.5rem; border: none; color: var(--van-red)"
          @click="deleteFriend"
          >删除联系人</van-button
        >
      </div>
    </section>
  </van-popup>
</template>

<style lang="less" scoped>
.van-cell-group {
  margin-bottom: 0.5rem;
}
</style>

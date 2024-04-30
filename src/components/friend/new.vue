<script setup>
import CommonSearch from "../common/search.vue";
import FriendAdd from "../friend/add.vue";
import { ref } from "vue";
const props = defineProps({ show: Boolean });
//调用父组件关闭弹窗
defineEmits(["hide"]);

const showFriendAdd = ref(false);
const showSearch = ref(false);
const searchResult = ref([]);
const onSearch = (value) => {};
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
        title="新的朋友"
        left-arrow
        :right-text="'添加朋友'"
        @click-left="$emit('hide')"
        @click-right="showFriendAdd = true"
      />
      <van-search
        placeholder="账号/手机号"
        input-align="center"
        @focus="showSearch = true"
      />
    </header>
    <main>
      <van-cell-group title="近三天">
        <van-swipe-cell>
          <van-cell :center="true">
            <template #title>
              <van-image
                height="2.5rem"
                width="2.5rem"
                radius="0.2rem"
                src="https://img.yzcdn.cn/vant/cat.jpeg"
              />
              <div class="left-box" style="">
                <span>123</span>
                <span>11111111111assadsadadddddddddddddadsssssssss</span>
              </div>
            </template>
            <template #right-icon>
              <div class="right-box" style="">
                <span>已添加</span>
              </div>
            </template>
          </van-cell>
          <template #right>
            <van-button
              square
              type="danger"
              text="删除"
              style="height: inherit"
            />
          </template>
        </van-swipe-cell>
      </van-cell-group>
      <van-cell-group title="三天前">
        <van-swipe-cell>
          <van-cell :center="true">
            <template #title>
              <van-image
                height="2.5rem"
                width="2.5rem"
                radius="0.2rem"
                src="https://img.yzcdn.cn/vant/cat.jpeg"
              />
              <div class="left-box" style="">
                <span>123</span>
                <span>11111111111</span>
              </div>
            </template>
            <template #right-icon>
              <div class="right-box" style="">
                <span>已添加</span>
              </div>
            </template>
          </van-cell>
          <template #right>
            <van-button
              square
              type="danger"
              text="删除"
              style="height: inherit"
            />
          </template>
        </van-swipe-cell>
      </van-cell-group>
    </main>
  </van-popup>
  <common-search
    :show="showSearch"
    @hide="showSearch = false"
    action="friend"
    placeholder="账号/手机号"
    @search="onSearch"
    :result="searchResult"
  />

  <friend-add
    :show="showFriendAdd"
    @showSearch="showSearch = true"
    @hide="showFriendAdd = false"
  />
</template>
<style scoped lang="less"></style>

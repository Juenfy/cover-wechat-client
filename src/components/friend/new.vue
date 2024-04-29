<script setup>
const props = defineProps({ show: Boolean });
//调用父组件关闭弹窗
defineEmits(["hide"]);
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
        @click-right="onClickRight"
      />
      <van-search placeholder="账号/手机号" input-align="center" />
    </header>
    <main>
      <van-cell-group title="近三天">
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
      </van-cell-group>
      <van-cell-group title="三天前">
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
      </van-cell-group>
    </main>
  </van-popup>
</template>
<style scoped lang="less">
main {
  .right-box {
    height: 2.5rem;
    span {
      color: var(--theme-text-color-tint);
    }
  }
  .left-box {
    margin-left: 0.5rem;
    height: 2.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;

    > span {
      display: block;
      width: 15rem;
      overflow: hidden; /* 隐藏超出部分 */
      text-overflow: ellipsis; /* 超出部分显示为省略号 */
    }

    > span:first-child {
      font-size: 18px;
    }
    > span:last-child {
      color: var(--theme-text-color-tint);
    }
  }
}
</style>

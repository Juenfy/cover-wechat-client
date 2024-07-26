<script setup>
const props = defineProps({
  show: Boolean,
  chatInfo: Object,
  updateField: String,
});
//调用父组件关闭弹窗
const emit = defineEmits(["hide"]);
</script>
<template>
  <van-popup
    v-model:show="props.show"
    position="right"
    :style="{ height: '100%', width: '100%' }"
    duration="0.2"
  >
    <header>
      <van-nav-bar left-arrow @click-left="$emit('hide')" />
    </header>
    <section>
      <div class="header"></div>
      <div class="container"></div>
    </section>
  </van-popup>
</template>
<style scoped lang="less"></style>

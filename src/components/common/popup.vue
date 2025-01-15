<script setup>
const props = defineProps({
  show: Boolean,
  title: String,
  popupStyle: {
    type: String,
    default: "height: 100%;width: 100%;background: var(--van-nav-bar-background);",
  },
  containerStyle: String
});
const emit = defineEmits(["hide", "submit"]);
</script>

<template>
  <van-popup v-model:show="props.show" position="right" :style="popupStyle" duration="0.2">
    <header>
      <slot name="header">
        <van-nav-bar :title="title" left-text="取消" @click-left="$emit('hide')" @click-right="$emit('submit')"
                     :border="false">
          <template #right>
            <van-button type="primary" size="small">完成</van-button>
          </template>
        </van-nav-bar>
      </slot>
    </header>
    <section class="bg-nav">
      <div class="header"></div>
      <div class="container" :style="containerStyle">
        <slot name="container"></slot>
      </div>
    </section>
    <slot name="extend"></slot>
  </van-popup>
</template>
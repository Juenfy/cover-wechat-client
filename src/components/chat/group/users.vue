<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  show: Boolean,
  users: Array,
  title: {
    type: String,
    default: "选择提醒的人"
  },
  multiple: {
    type: Boolean,
    default: true
  }
});
//调用父组件关闭弹窗
const emit = defineEmits(["hide", "select"]);
const users = ref([]);
const multiChoose = ref(false);

const handleMultiChoose = () => {
  multiChoose.value = !multiChoose.value;
};

const finishMultiChoose = () => {
  let checkedUsers = users.value.filter((user) => {
    return user.checked;
  });
  emit("select", checkedUsers);
};
const finishSingleChoose = (item) => {
  if (multiChoose.value) {
    return;
  }
  emit("select", props.multiple ? [item] : item);
};

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      users.value = [];
      multiChoose.value = false;
      props.users.forEach((user) => {
        user.checked = false;
        users.value.push(user);
      });
    }
  }
);
</script>
<template>
  <van-popup v-model:show="props.show" round position="bottom" :style="{ height: '60%', width: '100%' }" duration="0.2">
    <section>
      <div class="header">
        <van-nav-bar :title="props.title" :border="false">
          <template #right v-if="props.multiple">
            <van-button v-if="multiChoose" type="primary" size="small" @click="finishMultiChoose">完成</van-button>
            <span v-else @click="handleMultiChoose" style="color: var(--friend-add-qrcode-text)">多选</span>
          </template>
          <template #left>
            <span v-if="multiChoose" @click="handleMultiChoose" style="color: var(--friend-add-qrcode-text)">取消</span>
            <van-icon v-else name="arrow-down" @click="$emit('hide')" />
          </template>
        </van-nav-bar>
      </div>
      <div class="container at-user-container">
        <van-cell-group :border="false">
          <van-cell :title="item.nickname" size="large" :center="true" v-for="item in users" :key="item.id" clickable
            @click="finishSingleChoose(item)">
            <template #icon>
              <van-checkbox v-model="item.checked" v-if="multiChoose"></van-checkbox>
              <van-image width="3rem" height="3rem" :src="item.avatar" radius="0.3rem" />
            </template>
          </van-cell>
        </van-cell-group>
      </div>
    </section>
  </van-popup>
</template>
<style lang="less">
.at-user-container {

  .van-checkbox,
  .van-image {
    margin-right: 1rem;
    border-radius: 0.3rem;
  }
}
</style>

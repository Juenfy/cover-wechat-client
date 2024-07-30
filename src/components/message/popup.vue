<!--消息汽包通知组件-->
<script setup>
import { computed, watch } from "vue";
import { useRouter } from "vue-router";
import { ActionApply, ActionSend } from "@/enums/message";
const props = defineProps({ show: Boolean, message: Object, action: String });
//调用父组件关闭弹窗
const emit = defineEmits(["hide"]);
const router = useRouter();
const handleClick = () => {
  emit("hide");
  switch (props.action) {
    case ActionApply:
      router.push({
        name: "friend",
        query: {
          show_friend_new: 1,
        },
      });
      break;
    case ActionSend:
      router.push({
        name: "chat-message",
        params: {
          to_user:
            props.message.is_group == 1
              ? props.message.to_user
              : props.message.from.id,
          is_group: props.message.is_group,
        },
      });
      break;
  }
};
watch(
  () => props.show,
  (val) => {
    if (val) {
      setTimeout(() => {
        emit("hide");
      }, 3000);
    }
  }
);
const content = computed(() => {
  return props.message.from.nickname + "：" + props.message.content;
});
</script>
<template>
  <div>
    <van-popup
      v-model:show="props.show"
      position="top"
      :overlay="false"
      style="
        height: 4rem;
        width: 90%;
        margin-top: 0.5rem;
        margin-left: 5%;
        border-radius: 0.5rem;
        box-shadow: 10px 10px 15px rgba(0, 0, 0, 0.5);
        box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2),
          0px 1px 2px rgba(150, 150, 150, 0.2);
      "
      @click="handleClick"
    >
      <van-grid
        direction="horizontal"
        :column-num="4"
        :border="false"
        icon-size="2rem"
      >
        <van-grid-item
          icon="/wechat.png"
          :text="content"
          class="message-popup"
        />
      </van-grid>
    </van-popup>
  </div>
</template>
<style scoped lang="less"></style>

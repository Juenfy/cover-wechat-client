<script setup>
import { ref } from "vue";
import { useAppStore } from "@/stores/app";
import * as momentApi from "@/api/moment";

const props = defineProps({ show: Boolean, momentId: Number, toUser: Number, placeholder: String }); //action决定了当前是要搜索什么的意思
const emit = defineEmits(["hide", "commentSuccessCb"]);
const appStore = useAppStore();
const textareaRef = ref(null);
const popupEmojiBottom = ref(false);
const content = ref("");

const submitComment = () => {
    if (content.value) {
        momentApi.comment({
          id: props.momentId,
          to_user: props.toUser,
          content: content.value,
        }).then(res => {
          if(res.code == 200001) {
            emit("commentSuccessCb", res.data);
            emit("hide");
            content.value = "";
          }
        })
    }
};

const hideMe = () => {
  emit("hide");
  content.value = "";
}

const onSelectEmoji = (emoji) => {
    content.value += emoji.detail.unicode;
    textareaRef.value.focus();
};
</script>
<template>
    <van-popup v-model:show="props.show" position="bottom" style="height: 100%;width: 100%;background: transparent"
        :autofocus="true" duration="0.2" closeable @click-close-icon="hideMe">
        <div class="comment message-input-box">
            <div class="top">
                <textarea type="text" v-model="content" @keyup.enter="submitComment" ref="textareaRef" :placeholder="placeholder" style="overflow-y: auto;font-size: 0.8rem"></textarea>
                <div class="emoji">
                    <van-icon :name="appStore.icon.emoji" @click="popupEmojiBottom = !popupEmojiBottom" />
                </div>
            </div>
            <emoji-picker :class="popupEmojiBottom
                ? 'emoji-bottom emoji-bottom-popup'
                : 'emoji-bottom'
                " @emojiClick="onSelectEmoji" />
        </div>
    </van-popup>
</template>
<style scoped lang="less">
.comment {
    width: 100%;
    box-sizing: border-box;
    height: auto;
    position: fixed;
    bottom: 0;
    left: 0;
    >.top {
        >textarea {
            width: 100%;
        }
    }
    >.emoji-bottom {
        padding: 0;
    }
}
</style>

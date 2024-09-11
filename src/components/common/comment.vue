<script setup>
import { ref } from "vue";
import { useAppStore } from "@/stores/app";

const props = defineProps({ show: Boolean, momentId: Number, toUser: Number }); //action决定了当前是要搜索什么的意思
const emit = defineEmits(["hide"]);
const appStore = useAppStore();
const textareaRef = ref(null);
const popupEmojiBottom = ref(false);
const content = ref("");
const submitComment = () => {
    if (content.value) {
        if (textareaRef.value.scrollHeight > 36)
            textareaRef.value.style.height = '36px';
        console.log(props.momentId, props.toUser, content.value);
    }
};

const onSelectEmoji = (emoji) => {
    content.value += emoji.detail.unicode;
    textareaRef.value.focus();
};
</script>
<template>
    <van-popup v-model:show="props.show" position="bottom" style="height: 100%;width: 100%;background: transparent"
        :autofocus="true" duration="0.2" closeable @click-close-icon="$emit('hide')">
        <div class="comment">
            <div class="textarea">
                <textarea type="text" v-model="content" @keyup.ctrl.enter="submitComment" ref="textareaRef"></textarea>
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

    >div,
    emoji-picker {
        width: inherit;
        padding: 1rem 0;
        background-color: var(--messge-footer-background);
        display: flex;
        border-top: 1px solid var(--van-nav-bar-border-color);
    }

    >.textarea {
        border-top: none;

        >textarea {
            border: none;
            outline: none;
            height: 36px;
            width: 100%;
            font-weight: bold;
            border-radius: 0.2rem;
            color: var(--black-white-color);
            background: var(--messge-footer-input-background);
            box-sizing: border-box;
            padding: 9px 5px;
            resize: none;
            overflow-y: scroll;
            margin-left: 10px;
        }

        >.emoji {
            height: inherit;
            font-size: 24px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 10px;
        }
    }

    >.emoji-bottom {
        padding: 0;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.2s ease-in-out;
    }

    >.emoji-bottom-popup {
        max-height: 18rem;
    }

    emoji-picker {
        width: inherit;
        height: 18rem;
        --background: var(--messge-footer-background);
    }
}
</style>

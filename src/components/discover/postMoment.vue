<script setup>
import { watch, ref, onMounted } from "vue";
import { TypeText, TypeImage } from "@/enums/moment";
import { showFailToast, showSuccessToast, showLoadingToast, closeToast } from "vant";
import * as momentApi from "@/api/moment";
import "emoji-picker-element";
import { useAppStore } from "@/stores/app";

const props = defineProps({ show: Boolean, fileList: Array, postType: String });
//调用父组件关闭弹窗
const emit = defineEmits(["hide", "postSuccessCb"]);
const title = ref("");
const fileList = ref([]);
const content = ref("");
const textareaRef = ref(null);
const appStore = useAppStore();
const showEmoji = ref(false);
watch(
    () => props.show,
    (show) => {
        if (show) {
            title.value = props.postType == TypeText ? '发表文字' : '';
            content.value = '';
            fileList.value = props.fileList;
            console.log(fileList.value);
        }
    }
);
const onSubmit = () => {
    const formData = new FormData();
    formData.append("type", props.postType);
    formData.append("content", content.value);
    if (props.postType == TypeImage && fileList.value.length <= 0) {
        return showFailToast("图文需要选择图片");
    }
    fileList.value.forEach(file => {
        formData.append("files[]", file.file);
    });
    showLoadingToast("发布中...");
    momentApi.publish(formData, (process) => {
    }).then((res) => {
        if (res.code == 200001) {
            showSuccessToast("发布成功");
            emit("postSuccessCb", res.data);
        } else {
            return showSuccessToast("发布成功");
        }
    }).finally(() => {
        closeToast(true);
    });
};

const onSelectEmoji = (emoji) => {
    content.value += emoji.detail.unicode;
    textareaRef.value.focus();
};

//消息输入框重置高度
const autoResizeTextarea = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
};
</script>
<template>
    <van-popup v-model:show="props.show" position="right" :style="{ height: '100%', width: '100%' }" duration="0.2">
        <header>
            <van-nav-bar :title="title" left-text="取消" @click-left="$emit('hide')" @click-right="onSubmit"
                :border="false">
                <template #right>
                    <van-button type="primary" size="small">发表</van-button>
                </template>
            </van-nav-bar>
        </header>
        <section>
            <div class="header"></div>
            <div class="container post-menu-container bg-white">
                <textarea type="text" v-model="content" @input="autoResizeTextarea" ref="textareaRef"></textarea>
                <van-uploader v-model="fileList" multiple max-count="9" v-if="props.postType != TypeText" />
                <van-popover v-model:show="showEmoji" actions-direction="horizontal" placement="bottom-start">
                    <emoji-picker @emojiClick="onSelectEmoji" class="bg-white" />
                    <template #reference>
                        <van-icon :name="appStore.icon.emoji" />
                    </template>
                </van-popover>
            </div>
        </section>
    </van-popup>
</template>
<style scoped lang="less">
.post-menu-container {
    box-sizing: border-box;
    padding: 0 2.5rem;

    textarea {
        width: 100%;
        font-size: 16px;
        margin: 1rem 0;
        background: transparent;
        border: none;
        color: var(--black-white-color);
        height: auto;
        max-height: 250px;

    }


}

emoji-picker {
    --border-color: var(--van-popover-light-background);
    --background: var(--van-popover-light-background);
}
</style>
<!--仅聊天的朋友组件-->
<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/app";
import * as friendApi from "@/api/friend";
import { SearchOnlyChatFriend } from "@/enums/app";
const props = defineProps({ show: Boolean });
//调用父组件关闭弹窗
const emit = defineEmits(["hide"]);
const router = useRouter();
const appStore = useAppStore();
const onlyChatIndexList = ref([]);
const onlyChatFriendList = ref({});
const onSearchFocus = () => {
    appStore.setShowCommonSearch(true);
    appStore.initCommonSearch({
        action: SearchOnlyChatFriend,
        placeholder: "搜索",
    });
};

const getOnlyChatFriendList = async () => {
    friendApi.getList('only_chat').then((res) => {
        onlyChatFriendList.value = res.data;
        onlyChatIndexList.value = Object.keys(res.data);
    });
};

//前往好友主页
const gotoFriendInfo = (keywords) => {
    router.push({
        name: "friend-info",
        query: {
            keywords: keywords,
        },
    });
};

watch(
    () => props.show,
    (newVal) => {
        if (newVal) {
            getOnlyChatFriendList();
        }
    }
);
</script>

<template>
    <van-popup v-model:show="props.show" position="right" :style="{ height: '100%', width: '100%' }" duration="0.2">
        <header>
            <van-nav-bar title="仅聊天的朋友" left-arrow @click-left="$emit('hide')" :border="false" />
        </header>
        <section>
            <div class="header"></div>
            <div class="container">
                <van-search placeholder="搜索" input-align="center" @focus="onSearchFocus" />
                <div class="friend-list">
                    <van-index-bar :index-list="onlyChatIndexList">
                        <div v-for="val in onlyChatIndexList" :key="val">
                            <van-index-anchor :index="val" />
                            <van-swipe-cell v-for="item in onlyChatFriendList[val]" :key="item.friend">
                                <van-cell :title="item.nickname" :icon="item.avatar" size="large" :center="true"
                                    @click="gotoFriendInfo(item.keywords)" />
                                <template #right>
                                    <van-button square type="primary" text="备注" style="height: inherit"
                                        @click="showFriendRemark = true" />
                                </template>
                            </van-swipe-cell>
                        </div>
                    </van-index-bar>
                </div>
            </div>
        </section>
    </van-popup>
</template>

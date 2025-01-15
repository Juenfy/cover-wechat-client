<script setup>
import { ref } from 'vue';
import * as momentApi from '@/api/moment';
import { ActionComment } from '@/enums/moment';
import { useRouter } from "vue-router";
import { useAppStore } from '@/stores/app';
import MomentDetail from '@/components/discover/moment/detail.vue';

const props = defineProps({ show: Boolean });
//调用父组件关闭弹窗
defineEmits(["hide"]);

const router = useRouter();
const appStore = useAppStore();
const messageList = ref([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const page = ref(1);
const limit = ref(10);
const momentId = ref(0);
const userId = ref(0);
const showMomentDetail = ref(false);

const onLoadMessageList = async () => {
    setTimeout(() => {
        if (refreshing.value) {
            messageList.value = [];
            refreshing.value = false;
            page.value = 1;
        }
        momentApi.getMessageList(page.value, limit.value).then(res => {
            res.data.forEach(element => {
                messageList.value.push(element);
            });
            appStore.clearMomentUnread();
            ++page.value;
            loading.value = false;
            if (res.page_info.total_page < page.value) {
                finished.value = true;
            }
        });
    }, 100);
};

//下拉刷新朋友圈列表
const onRefreshMessageList = () => {
    //清空列表数据
    finished.value = false;

    //重新加载数据
    //将 loading 设置为 true，表示处于加载状态
    loading.value = true;
    onLoadMessageList();
};

//前往好友主页
const gotoFriendInfo = (keywords) => {
    router.push({
        name: "friend-info",
        query: {
            keywords: keywords,
        },
    });
}

//查看朋友圈详情
const gotoMomentDetail = (moment) => {
    momentId.value = moment.id;
    userId.value = moment.user_id;
    showMomentDetail.value = true;
}
</script>

<template>
    <van-popup v-model:show="props.show" position="right" :style="{ height: '100%', width: '100%' }" duration="0.2">
        <header>
            <van-nav-bar title="消息" left-arrow @click-left="$emit('hide')" :border="false" />
        </header>
        <section>
            <div class="header"></div>
            <van-pull-refresh v-model="refreshing" @refresh="onRefreshMessageList" class="container moment-container"
                style="background: var(--black20-white-color);">
                <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoadMessageList"
                    class="message-list">
                    <van-cell-group :border="false">
                        <van-cell v-for="item in messageList" :key="item.id" size="large"
                            @click="gotoMomentDetail(item.moment)">
                            <template #title>
                                <div class="title" style="margin-left: 0.5rem;">
                                    <div class="nickname">
                                        <b>{{ item.from.nickname }}</b>
                                    </div>
                                    <div class="content">
                                        <div class="comment" v-if="item.type == ActionComment">
                                            <span v-if="item.to_user > 0">回复了<b>{{
                                                item.to.nickname }}</b>：</span>
                                            <span>{{ item.content }}</span>
                                        </div>
                                        <div class="like" v-else>
                                            <van-icon name="like-o" color="var(--theme-blue-1970)" />
                                        </div>
                                    </div>
                                    <div class="time">{{ item.created_at }}</div>
                                </div>
                            </template>
                            <template #icon>
                                <van-image :src="item.from.avatar" height="3.5rem" width="3.5rem" radius="0.35rem"
                                    @click="gotoFriendInfo(item.from.wechat)" />
                            </template>
                            <template #right-icon>
                                <div class="right-icon">
                                    <van-image v-if="item.moment.files.length > 0"
                                        :src="item.moment.files[0]?.file.path" height="4.5rem" width="4.5rem"
                                        fit="cover" />
                                    <div class="content" v-else style="height: 4rem;width: 4rem;">
                                        <van-text-ellipsis :content="item.moment.content" rows="3" />
                                    </div>
                                </div>
                            </template>
                        </van-cell>
                    </van-cell-group>
                </van-list>
            </van-pull-refresh>
        </section>
    </van-popup>
    <moment-detail :show="showMomentDetail" @hide="showMomentDetail = false" :momentId="momentId" :userId="userId" />
</template>

<style lang="less">
.message-list {
    .title {
        .nickname {
            color: var(--theme-blue-1970);
        }

        .content {
            .comment {
                span {
                    color: var(--black-white-color);

                    b {
                        color: var(--theme-blue-1970);
                    }
                }
            }
        }

        .time {
            color: var(--theme-gray-70);
            font-size: 12px;
        }
    }

    .right-icon>.content {
        color: var(--theme-gray-70) !important;
        font-size: 12px !important;
    }
}
</style>